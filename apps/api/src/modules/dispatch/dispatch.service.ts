import { Injectable, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { QueueService } from '../../queue/queue.service';
import {
  EmergencyType,
  EmergencyRouting,
  IncidentPriority,
  DispatchConfig,
  AssignmentStatus,
  IncidentStatus,
  IncidentEventType,
  UnitStatus,
} from '@safepulse/shared';
import { RealtimeGateway } from '../realtime/realtime.gateway';

interface AvailableUnit {
  id: string;
  agency_id: string;
  call_sign: string;
  unit_type: string;
  distance_km: number;
}

@Injectable()
export class DispatchService {
  constructor(
    private readonly db: DatabaseService,
    private readonly queueService: QueueService,
    @Inject(forwardRef(() => RealtimeGateway))
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  /**
   * Find available units for an incident based on emergency type and location
   */
  async findAvailableUnits(
    emergencyType: EmergencyType,
    latitude: number,
    longitude: number,
    agencyId?: string,
    limit: number = 10,
  ): Promise<AvailableUnit[]> {
    const unitTypes = EmergencyRouting[emergencyType];

    // Query available units ordered by distance
    const units = await this.db.queryMany<AvailableUnit>(
      `SELECT
        u.id,
        u.agency_id,
        u.call_sign,
        u.unit_type,
        (
          6371 * acos(
            cos(radians($1)) * cos(radians(u.current_latitude)) *
            cos(radians(u.current_longitude) - radians($2)) +
            sin(radians($1)) * sin(radians(u.current_latitude))
          )
        ) AS distance_km
      FROM units u
      INNER JOIN agencies a ON u.agency_id = a.id
      WHERE u.status = 'available'
        AND u.is_on_duty = true
        AND u.current_latitude IS NOT NULL
        AND u.unit_type = ANY($3::unit_type[])
        AND a.is_active = true
        ${agencyId ? 'AND u.agency_id = $5' : ''}
      ORDER BY distance_km ASC
      LIMIT $4`,
      agencyId
        ? [latitude, longitude, unitTypes, limit, agencyId]
        : [latitude, longitude, unitTypes, limit],
    );

    return units;
  }

  /**
   * Main dispatch entry point - called when incident is created or needs reassignment
   */
  async dispatchIncident(
    incidentId: string,
    priority: IncidentPriority = IncidentPriority.NORMAL,
    assignedBy?: string,
  ): Promise<void> {
    const incident = await this.db.queryOne(
      `SELECT * FROM emergency_requests WHERE id = $1`,
      [incidentId],
    );

    if (!incident) {
      throw new BadRequestException('Incident not found');
    }

    if (!incident.latitude || !incident.longitude) {
      // Cannot auto-dispatch without location
      return;
    }

    const config =
      priority === IncidentPriority.HIGH || priority === IncidentPriority.CRITICAL
        ? DispatchConfig.high
        : DispatchConfig.normal;

    const units = await this.findAvailableUnits(
      incident.emergency_type,
      parseFloat(incident.latitude),
      parseFloat(incident.longitude),
      incident.agency_id,
      config.offerCount,
    );

    if (units.length === 0) {
      // No available units - schedule escalation
      await this.scheduleEscalation(incidentId, config.escalationMinutes);
      return;
    }

    if (config.offerStrategy === 'parallel') {
      // Parallel offers for high priority - offer to all at once
      await this.createParallelOffers(incidentId, units, config.offerTimeoutSeconds, assignedBy);
    } else {
      // Sequential offers - offer to first unit, queue others
      await this.createSequentialOffer(
        incidentId,
        units[0],
        config.offerTimeoutSeconds,
        assignedBy,
      );
    }

    // Update incident status
    await this.db.query(
      `UPDATE emergency_requests SET status = $1, dispatched_at = NOW() WHERE id = $2`,
      [IncidentStatus.DISPATCHED, incidentId],
    );
  }

  /**
   * Create a single assignment offer to a unit
   */
  async createAssignmentOffer(
    incidentId: string,
    unitId: string,
    timeoutSeconds: number,
    assignedBy?: string,
    isPrimary: boolean = false,
  ): Promise<string> {
    const expiresAt = new Date(Date.now() + timeoutSeconds * 1000);

    const assignment = await this.db.mutateOne<{ id: string }>(
      `INSERT INTO unit_assignments (
        incident_id, unit_id, status, expires_at, assigned_by, is_primary
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id`,
      [incidentId, unitId, AssignmentStatus.OFFERED, expiresAt, assignedBy, isPrimary],
    );

    // Mark unit as busy
    await this.db.query(`UPDATE units SET status = $1 WHERE id = $2`, [UnitStatus.BUSY, unitId]);

    // Schedule timeout job
    await this.queueService.scheduleOfferTimeout(assignment!.id, timeoutSeconds * 1000);

    // Create audit event
    await this.db.query(
      `INSERT INTO incident_events (incident_id, event_type, actor_id, metadata)
       VALUES ($1, $2, $3, $4)`,
      [
        incidentId,
        IncidentEventType.UNIT_ASSIGNED,
        assignedBy,
        JSON.stringify({ unitId, assignmentId: assignment!.id }),
      ],
    );

    // Notify unit via WebSocket
    await this.notifyUnitOfOffer(unitId, incidentId, assignment!.id);

    return assignment!.id;
  }

  private async createParallelOffers(
    incidentId: string,
    units: AvailableUnit[],
    timeoutSeconds: number,
    assignedBy?: string,
  ): Promise<void> {
    const promises = units.map((unit, index) =>
      this.createAssignmentOffer(incidentId, unit.id, timeoutSeconds, assignedBy, index === 0),
    );

    await Promise.all(promises);
  }

  private async createSequentialOffer(
    incidentId: string,
    unit: AvailableUnit,
    timeoutSeconds: number,
    assignedBy?: string,
  ): Promise<void> {
    await this.createAssignmentOffer(incidentId, unit.id, timeoutSeconds, assignedBy, true);
  }

  /**
   * Handle unit accepting an assignment
   */
  async acceptAssignment(assignmentId: string, unitId: string): Promise<void> {
    const assignment = await this.db.queryOne(
      `SELECT * FROM unit_assignments WHERE id = $1 AND unit_id = $2`,
      [assignmentId, unitId],
    );

    if (!assignment) {
      throw new BadRequestException('Assignment not found');
    }

    if (assignment.status !== AssignmentStatus.OFFERED) {
      throw new BadRequestException('Assignment already responded to');
    }

    if (new Date(assignment.expires_at) < new Date()) {
      throw new BadRequestException('Assignment offer has expired');
    }

    await this.db.transaction(async (client) => {
      // Update assignment
      await client.query(
        `UPDATE unit_assignments SET
          status = $1, responded_at = NOW(), is_primary = true
         WHERE id = $2`,
        [AssignmentStatus.ACCEPTED, assignmentId],
      );

      // Cancel other pending offers for this incident (parallel strategy)
      await client.query(
        `UPDATE unit_assignments SET status = $1
         WHERE incident_id = $2 AND id != $3 AND status = $4`,
        [AssignmentStatus.CANCELLED, assignment.incident_id, assignmentId, AssignmentStatus.OFFERED],
      );

      // Update incident
      await client.query(
        `UPDATE emergency_requests SET
          primary_unit_id = $1, status = $2
         WHERE id = $3`,
        [unitId, IncidentStatus.DISPATCHED, assignment.incident_id],
      );

      // Create audit event
      await client.query(
        `INSERT INTO incident_events (incident_id, event_type, actor_unit_id, metadata)
         VALUES ($1, $2, $3, $4)`,
        [
          assignment.incident_id,
          IncidentEventType.UNIT_ACCEPTED,
          unitId,
          JSON.stringify({ assignmentId }),
        ],
      );
    });

    // Cancel timeout job
    await this.queueService.cancelOfferTimeout(assignmentId);

    // Schedule en-route check
    await this.queueService.scheduleEnRouteCheck(
      assignmentId,
      assignment.incident_id,
      DispatchConfig.enRouteCheckMinutes * 60 * 1000,
    );

    // Notify via WebSocket
    this.realtimeGateway.emitToIncident(assignment.incident_id, 'assignment:accepted', {
      assignmentId,
      unitId,
    });
  }

  /**
   * Handle unit declining an assignment
   */
  async declineAssignment(assignmentId: string, unitId: string, reason: string): Promise<void> {
    const assignment = await this.db.queryOne(
      `SELECT * FROM unit_assignments WHERE id = $1 AND unit_id = $2`,
      [assignmentId, unitId],
    );

    if (!assignment) {
      throw new BadRequestException('Assignment not found');
    }

    if (assignment.status !== AssignmentStatus.OFFERED) {
      throw new BadRequestException('Assignment already responded to');
    }

    await this.db.transaction(async (client) => {
      await client.query(
        `UPDATE unit_assignments SET
          status = $1, responded_at = NOW(), decline_reason = $2
         WHERE id = $3`,
        [AssignmentStatus.DECLINED, reason, assignmentId],
      );

      // Make unit available again
      await client.query(`UPDATE units SET status = $1 WHERE id = $2`, [UnitStatus.AVAILABLE, unitId]);

      await client.query(
        `INSERT INTO incident_events (incident_id, event_type, actor_unit_id, metadata)
         VALUES ($1, $2, $3, $4)`,
        [
          assignment.incident_id,
          IncidentEventType.UNIT_DECLINED,
          unitId,
          JSON.stringify({ assignmentId, reason }),
        ],
      );
    });

    // Cancel timeout job
    await this.queueService.cancelOfferTimeout(assignmentId);

    // Try next unit (sequential strategy)
    await this.offerToNextUnit(assignment.incident_id);
  }

  /**
   * Handle offer timeout
   */
  async handleOfferTimeout(assignmentId: string): Promise<void> {
    const assignment = await this.db.queryOne(
      `SELECT * FROM unit_assignments WHERE id = $1`,
      [assignmentId],
    );

    if (!assignment || assignment.status !== AssignmentStatus.OFFERED) {
      return; // Already handled
    }

    await this.db.transaction(async (client) => {
      await client.query(
        `UPDATE unit_assignments SET status = $1 WHERE id = $2`,
        [AssignmentStatus.EXPIRED, assignmentId],
      );

      // Make unit available again
      await client.query(`UPDATE units SET status = $1 WHERE id = $2`, [
        UnitStatus.AVAILABLE,
        assignment.unit_id,
      ]);
    });

    // Try next unit
    await this.offerToNextUnit(assignment.incident_id);
  }

  /**
   * Offer to next available unit after decline/timeout
   */
  private async offerToNextUnit(incidentId: string): Promise<void> {
    const incident = await this.db.queryOne(
      `SELECT * FROM emergency_requests WHERE id = $1`,
      [incidentId],
    );

    if (!incident || incident.status === IncidentStatus.RESOLVED || incident.status === IncidentStatus.CANCELLED) {
      return;
    }

    // Get units that haven't been offered to yet
    const units = await this.db.queryMany<AvailableUnit>(
      `SELECT
        u.id,
        u.agency_id,
        u.call_sign,
        u.unit_type,
        (
          6371 * acos(
            cos(radians($1)) * cos(radians(u.current_latitude)) *
            cos(radians(u.current_longitude) - radians($2)) +
            sin(radians($1)) * sin(radians(u.current_latitude))
          )
        ) AS distance_km
      FROM units u
      WHERE u.status = 'available'
        AND u.is_on_duty = true
        AND u.current_latitude IS NOT NULL
        AND u.id NOT IN (
          SELECT unit_id FROM unit_assignments WHERE incident_id = $3
        )
      ORDER BY distance_km ASC
      LIMIT 1`,
      [parseFloat(incident.latitude), parseFloat(incident.longitude), incidentId],
    );

    if (units.length > 0) {
      await this.createAssignmentOffer(incidentId, units[0].id, DispatchConfig.normal.offerTimeoutSeconds);
    } else {
      // No more units - escalate
      await this.scheduleEscalation(incidentId, 1);
    }
  }

  /**
   * Schedule escalation for incident
   */
  private async scheduleEscalation(incidentId: string, delayMinutes: number): Promise<void> {
    await this.queueService.scheduleEscalation(incidentId, delayMinutes * 60 * 1000);
  }

  /**
   * Handle escalation
   */
  async handleEscalation(incidentId: string): Promise<void> {
    const incident = await this.db.queryOne(
      `SELECT * FROM emergency_requests WHERE id = $1`,
      [incidentId],
    );

    if (!incident || incident.status === IncidentStatus.RESOLVED || incident.status === IncidentStatus.CANCELLED) {
      return;
    }

    // Increment escalation level
    await this.db.query(
      `UPDATE emergency_requests SET
        escalation_level = escalation_level + 1,
        last_escalated_at = NOW()
       WHERE id = $1`,
      [incidentId],
    );

    // Create escalation event
    await this.db.query(
      `INSERT INTO incident_events (incident_id, event_type, metadata)
       VALUES ($1, $2, $3)`,
      [
        incidentId,
        IncidentEventType.ESCALATED,
        JSON.stringify({ level: incident.escalation_level + 1 }),
      ],
    );

    // Notify dispatchers
    if (incident.agency_id) {
      this.realtimeGateway.emitToAgency(incident.agency_id, 'escalation:alert', {
        incidentId,
        escalationLevel: incident.escalation_level + 1,
      });
    }

    // Expand search to adjacent regions/mixed responders
    const expandedUnits = await this.db.queryMany<AvailableUnit>(
      `SELECT
        u.id,
        u.agency_id,
        u.call_sign,
        u.unit_type,
        (
          6371 * acos(
            cos(radians($1)) * cos(radians(u.current_latitude)) *
            cos(radians(u.current_longitude) - radians($2)) +
            sin(radians($1)) * sin(radians(u.current_latitude))
          )
        ) AS distance_km
      FROM units u
      WHERE u.status = 'available'
        AND u.is_on_duty = true
        AND u.current_latitude IS NOT NULL
        AND u.id NOT IN (
          SELECT unit_id FROM unit_assignments WHERE incident_id = $3
        )
      ORDER BY distance_km ASC
      LIMIT 3`,
      [parseFloat(incident.latitude), parseFloat(incident.longitude), incidentId],
    );

    if (expandedUnits.length > 0) {
      await this.createParallelOffers(incidentId, expandedUnits, DispatchConfig.high.offerTimeoutSeconds);
    }
  }

  private async notifyUnitOfOffer(unitId: string, incidentId: string, assignmentId: string): Promise<void> {
    const incident = await this.db.queryOne(
      `SELECT er.*, ls.latitude as loc_lat, ls.longitude as loc_lng, ls.accuracy as loc_accuracy
       FROM emergency_requests er
       LEFT JOIN location_snapshots ls ON ls.incident_id = er.id
       WHERE er.id = $1
       ORDER BY ls.captured_at DESC
       LIMIT 1`,
      [incidentId],
    );

    this.realtimeGateway.emitToUnit(unitId, 'assignment:offered', {
      assignmentId,
      incident: {
        id: incident.id,
        emergencyType: incident.emergency_type,
        priority: incident.priority,
        callerPhone: incident.caller_phone,
        callerName: incident.caller_name,
        latitude: incident.loc_lat || incident.latitude,
        longitude: incident.loc_lng || incident.longitude,
        accuracy: incident.loc_accuracy || incident.accuracy,
        landmark: incident.landmark,
        createdAt: incident.created_at,
      },
    });
  }
}
