import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { DispatchService } from '../dispatch/dispatch.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import {
  UnitStatus,
  IncidentStatus,
  AssignmentStatus,
  IncidentEventType,
} from '@safepulse/shared';
import { UpdateUnitStatusDto, UpdateIncidentStatusDto, UnitLocationDto } from './dto/unit.dto';

@Injectable()
export class UnitsService {
  constructor(
    private readonly db: DatabaseService,
    @Inject(forwardRef(() => DispatchService))
    private readonly dispatchService: DispatchService,
    @Inject(forwardRef(() => RealtimeGateway))
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async getUnitByUserId(userId: string) {
    const unit = await this.db.queryOne(
      `SELECT u.*, a.name as agency_name, a.type as agency_type
       FROM units u
       JOIN agencies a ON u.agency_id = a.id
       WHERE u.assigned_user_id = $1`,
      [userId],
    );

    if (!unit) {
      throw new NotFoundException('Unit not found for this user');
    }

    return this.formatUnit(unit);
  }

  async getUnitById(unitId: string) {
    const unit = await this.db.queryOne(
      `SELECT u.*, a.name as agency_name
       FROM units u
       JOIN agencies a ON u.agency_id = a.id
       WHERE u.id = $1`,
      [unitId],
    );

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    return this.formatUnit(unit);
  }

  async updateUnitStatus(unitId: string, dto: UpdateUnitStatusDto) {
    const unit = await this.db.mutateOne(
      `UPDATE units SET
        status = $1,
        is_on_duty = $2,
        updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [dto.status, dto.isOnDuty ?? true, unitId],
    );

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    // Notify via WebSocket
    this.realtimeGateway.emitToAgency(unit.agency_id, 'unit:status_changed', {
      unitId,
      status: dto.status,
      isOnDuty: dto.isOnDuty,
    });

    return { success: true, status: dto.status };
  }

  async updateUnitLocation(unitId: string, dto: UnitLocationDto) {
    await this.db.query(
      `UPDATE units SET
        current_latitude = $1,
        current_longitude = $2,
        current_accuracy = $3,
        last_location_at = NOW(),
        updated_at = NOW()
       WHERE id = $4`,
      [dto.latitude, dto.longitude, dto.accuracy, unitId],
    );

    return { success: true };
  }

  async getUnitAssignments(unitId: string, activeOnly?: boolean) {
    let query = `
      SELECT ua.*, er.emergency_type, er.status as incident_status,
             er.caller_phone, er.caller_name, er.latitude, er.longitude,
             er.landmark, er.priority, er.created_at as incident_created_at
      FROM unit_assignments ua
      JOIN emergency_requests er ON ua.incident_id = er.id
      WHERE ua.unit_id = $1
    `;

    if (activeOnly) {
      query += ` AND ua.status IN ('offered', 'accepted')
                 AND er.status NOT IN ('resolved', 'cancelled', 'closed')`;
    }

    query += ` ORDER BY ua.created_at DESC`;

    const assignments = await this.db.queryMany(query, [unitId]);
    return assignments.map(this.formatAssignment);
  }

  async acceptAssignment(unitId: string, assignmentId: string) {
    await this.dispatchService.acceptAssignment(assignmentId, unitId);
    return { success: true };
  }

  async declineAssignment(unitId: string, assignmentId: string, reason: string) {
    await this.dispatchService.declineAssignment(assignmentId, unitId, reason);
    return { success: true };
  }

  async getAssignmentDetails(unitId: string, assignmentId: string) {
    const assignment = await this.db.queryOne(
      `SELECT ua.*, er.*,
              ls.latitude as latest_lat, ls.longitude as latest_lng,
              ls.accuracy as latest_accuracy, ls.captured_at as latest_loc_time
       FROM unit_assignments ua
       JOIN emergency_requests er ON ua.incident_id = er.id
       LEFT JOIN LATERAL (
         SELECT * FROM location_snapshots
         WHERE incident_id = er.id
         ORDER BY captured_at DESC
         LIMIT 1
       ) ls ON true
       WHERE ua.id = $1 AND ua.unit_id = $2`,
      [assignmentId, unitId],
    );

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    return this.formatAssignmentDetails(assignment);
  }

  async updateIncidentStatus(
    unitId: string,
    incidentId: string,
    dto: UpdateIncidentStatusDto,
  ) {
    // Verify unit is assigned to this incident
    const assignment = await this.db.queryOne(
      `SELECT * FROM unit_assignments
       WHERE unit_id = $1 AND incident_id = $2 AND status = 'accepted'`,
      [unitId, incidentId],
    );

    if (!assignment) {
      throw new ForbiddenException('Not assigned to this incident');
    }

    const validStatuses = [IncidentStatus.EN_ROUTE, IncidentStatus.ON_SCENE];
    if (!validStatuses.includes(dto.status as IncidentStatus)) {
      throw new BadRequestException('Invalid status for unit update');
    }

    await this.db.transaction(async (client) => {
      await client.query(
        `UPDATE emergency_requests SET status = $1, updated_at = NOW() WHERE id = $2`,
        [dto.status, incidentId],
      );

      const eventType =
        dto.status === IncidentStatus.EN_ROUTE
          ? IncidentEventType.UNIT_EN_ROUTE
          : IncidentEventType.UNIT_ON_SCENE;

      await client.query(
        `INSERT INTO incident_events (incident_id, event_type, actor_unit_id, metadata)
         VALUES ($1, $2, $3, $4)`,
        [incidentId, eventType, unitId, JSON.stringify({ notes: dto.notes })],
      );
    });

    // Notify via WebSocket
    this.realtimeGateway.emitToIncident(incidentId, 'incident:updated', {
      incidentId,
      status: dto.status,
      unitId,
    });

    return { success: true, status: dto.status };
  }

  async recordLocationPing(unitId: string, incidentId: string, dto: UnitLocationDto) {
    // Get active assignment
    const assignment = await this.db.queryOne(
      `SELECT id FROM unit_assignments
       WHERE unit_id = $1 AND incident_id = $2 AND status = 'accepted'`,
      [unitId, incidentId],
    );

    if (!assignment) {
      throw new ForbiddenException('Not assigned to this incident');
    }

    await this.db.query(
      `INSERT INTO unit_location_pings (
        unit_id, incident_id, assignment_id,
        latitude, longitude, accuracy, heading, speed, captured_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [
        unitId,
        incidentId,
        assignment.id,
        dto.latitude,
        dto.longitude,
        dto.accuracy,
        dto.heading,
        dto.speed,
      ],
    );

    // Update unit's current location
    await this.updateUnitLocation(unitId, dto);

    // Notify via WebSocket
    this.realtimeGateway.emitToIncident(incidentId, 'unit_location:updated', {
      unitId,
      latitude: dto.latitude,
      longitude: dto.longitude,
      heading: dto.heading,
    });

    return { success: true };
  }

  async resolveIncident(unitId: string, incidentId: string, notes?: string) {
    const assignment = await this.db.queryOne(
      `SELECT * FROM unit_assignments
       WHERE unit_id = $1 AND incident_id = $2 AND status = 'accepted'`,
      [unitId, incidentId],
    );

    if (!assignment) {
      throw new ForbiddenException('Not assigned to this incident');
    }

    await this.db.transaction(async (client) => {
      await client.query(
        `UPDATE emergency_requests SET
          status = $1, resolved_at = NOW(), updated_at = NOW()
         WHERE id = $2`,
        [IncidentStatus.RESOLVED, incidentId],
      );

      await client.query(
        `UPDATE unit_assignments SET status = 'completed' WHERE id = $1`,
        [assignment.id],
      );

      // Make unit available again
      await client.query(`UPDATE units SET status = $1 WHERE id = $2`, [
        UnitStatus.AVAILABLE,
        unitId,
      ]);

      await client.query(
        `INSERT INTO incident_events (incident_id, event_type, actor_unit_id, metadata)
         VALUES ($1, $2, $3, $4)`,
        [incidentId, IncidentEventType.RESOLVED, unitId, JSON.stringify({ notes, resolvedBy: 'unit' })],
      );
    });

    this.realtimeGateway.emitToIncident(incidentId, 'incident:resolved', { incidentId, unitId });

    return { success: true, status: IncidentStatus.RESOLVED };
  }

  async requestBackup(unitId: string, incidentId: string, notes?: string) {
    const assignment = await this.db.queryOne(
      `SELECT ua.*, er.agency_id, er.emergency_type, er.latitude, er.longitude
       FROM unit_assignments ua
       JOIN emergency_requests er ON ua.incident_id = er.id
       WHERE ua.unit_id = $1 AND ua.incident_id = $2 AND ua.status = 'accepted'`,
      [unitId, incidentId],
    );

    if (!assignment) {
      throw new ForbiddenException('Not assigned to this incident');
    }

    await this.db.query(
      `INSERT INTO incident_events (incident_id, event_type, actor_unit_id, metadata)
       VALUES ($1, $2, $3, $4)`,
      [incidentId, IncidentEventType.BACKUP_REQUESTED, unitId, JSON.stringify({ notes })],
    );

    // Notify agency
    this.realtimeGateway.emitToAgency(assignment.agency_id, 'backup:requested', {
      incidentId,
      unitId,
      notes,
    });

    // Trigger additional dispatch
    await this.dispatchService.dispatchIncident(incidentId);

    return { success: true };
  }

  async reportCantLocate(unitId: string, incidentId: string, notes?: string) {
    const assignment = await this.db.queryOne(
      `SELECT * FROM unit_assignments
       WHERE unit_id = $1 AND incident_id = $2 AND status = 'accepted'`,
      [unitId, incidentId],
    );

    if (!assignment) {
      throw new ForbiddenException('Not assigned to this incident');
    }

    await this.db.query(
      `INSERT INTO incident_events (incident_id, event_type, actor_unit_id, metadata)
       VALUES ($1, $2, $3, $4)`,
      [incidentId, IncidentEventType.CANT_LOCATE, unitId, JSON.stringify({ notes })],
    );

    // Get incident for agency notification
    const incident = await this.db.queryOne(
      `SELECT agency_id FROM emergency_requests WHERE id = $1`,
      [incidentId],
    );

    if (incident?.agency_id) {
      this.realtimeGateway.emitToAgency(incident.agency_id, 'incident:cant_locate', {
        incidentId,
        unitId,
        notes,
      });
    }

    return { success: true };
  }

  async getAssignmentHistory(unitId: string, limit: number, offset: number) {
    const assignments = await this.db.queryMany(
      `SELECT ua.*, er.emergency_type, er.status as incident_status,
              er.priority, er.created_at as incident_created_at, er.resolved_at
       FROM unit_assignments ua
       JOIN emergency_requests er ON ua.incident_id = er.id
       WHERE ua.unit_id = $1
       ORDER BY ua.created_at DESC
       LIMIT $2 OFFSET $3`,
      [unitId, limit, offset],
    );

    return assignments.map(this.formatAssignment);
  }

  private formatUnit(unit: any) {
    return {
      id: unit.id,
      agencyId: unit.agency_id,
      agencyName: unit.agency_name,
      callSign: unit.call_sign,
      unitType: unit.unit_type,
      status: unit.status,
      isOnDuty: unit.is_on_duty,
      phoneNumber: unit.phone_number,
      currentLocation: unit.current_latitude
        ? {
            latitude: parseFloat(unit.current_latitude),
            longitude: parseFloat(unit.current_longitude),
            accuracy: unit.current_accuracy ? parseFloat(unit.current_accuracy) : null,
          }
        : null,
      lastLocationAt: unit.last_location_at,
    };
  }

  private formatAssignment(assignment: any) {
    return {
      id: assignment.id,
      incidentId: assignment.incident_id,
      status: assignment.status,
      offeredAt: assignment.offered_at,
      respondedAt: assignment.responded_at,
      expiresAt: assignment.expires_at,
      isPrimary: assignment.is_primary,
      incident: {
        emergencyType: assignment.emergency_type,
        status: assignment.incident_status,
        priority: assignment.priority,
        callerPhone: assignment.caller_phone,
        callerName: assignment.caller_name,
        latitude: assignment.latitude ? parseFloat(assignment.latitude) : null,
        longitude: assignment.longitude ? parseFloat(assignment.longitude) : null,
        landmark: assignment.landmark,
        createdAt: assignment.incident_created_at,
      },
    };
  }

  private formatAssignmentDetails(assignment: any) {
    return {
      ...this.formatAssignment(assignment),
      incident: {
        id: assignment.incident_id,
        emergencyType: assignment.emergency_type,
        status: assignment.status,
        priority: assignment.priority,
        callerPhone: assignment.caller_phone,
        callerName: assignment.caller_name,
        description: assignment.description,
        notes: assignment.dispatcher_notes,
        latitude: assignment.latest_lat
          ? parseFloat(assignment.latest_lat)
          : assignment.latitude
          ? parseFloat(assignment.latitude)
          : null,
        longitude: assignment.latest_lng
          ? parseFloat(assignment.latest_lng)
          : assignment.longitude
          ? parseFloat(assignment.longitude)
          : null,
        accuracy: assignment.latest_accuracy
          ? parseFloat(assignment.latest_accuracy)
          : assignment.accuracy
          ? parseFloat(assignment.accuracy)
          : null,
        landmark: assignment.landmark,
        locationUpdatedAt: assignment.latest_loc_time,
        createdAt: assignment.created_at,
      },
    };
  }
}
