import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { DispatchService } from '../dispatch/dispatch.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { AuthenticatedUser } from '../../auth/auth.service';
import {
  IncidentStatus,
  IncidentEventType,
  UnitStatus,
} from '@safepulse/shared';
import {
  AcknowledgeIncidentDto,
  UpdateIncidentStatusDto,
  AssignUnitDto,
  SendMessageDto,
  IncidentFiltersDto,
} from './dto/dispatcher.dto';

@Injectable()
export class DispatcherService {
  constructor(
    private readonly db: DatabaseService,
    @Inject(forwardRef(() => DispatchService))
    private readonly dispatchService: DispatchService,
    @Inject(forwardRef(() => RealtimeGateway))
    private readonly realtimeGateway: RealtimeGateway,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  async getIncidents(agencyId: string, filters: IncidentFiltersDto) {
    let query = `
      SELECT er.*,
             u.call_sign as unit_call_sign,
             u.status as unit_status,
             (SELECT COUNT(*) FROM incident_events WHERE incident_id = er.id) as event_count,
             (SELECT MAX(created_at) FROM incident_events WHERE incident_id = er.id) as last_event_at
      FROM emergency_requests er
      LEFT JOIN units u ON er.primary_unit_id = u.id
      WHERE (er.agency_id = $1 OR er.agency_id IS NULL)
    `;

    const params: any[] = [agencyId];
    let paramIndex = 2;

    if (filters.status?.length) {
      query += ` AND er.status = ANY($${paramIndex}::incident_status[])`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.type?.length) {
      query += ` AND er.emergency_type = ANY($${paramIndex}::emergency_type[])`;
      params.push(filters.type);
      paramIndex++;
    }

    if (filters.priority?.length) {
      query += ` AND er.priority = ANY($${paramIndex}::incident_priority[])`;
      params.push(filters.priority);
      paramIndex++;
    }

    if (filters.region) {
      query += ` AND EXISTS (
        SELECT 1 FROM agencies a WHERE a.id = er.agency_id AND a.region = $${paramIndex}
      )`;
      params.push(filters.region);
      paramIndex++;
    }

    query += ` ORDER BY
      CASE er.priority
        WHEN 'critical' THEN 1
        WHEN 'high' THEN 2
        WHEN 'normal' THEN 3
        WHEN 'low' THEN 4
      END,
      er.created_at DESC
    `;

    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const incidents = await this.db.queryMany(query, params);

    // Get total count
    const countResult = await this.db.queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM emergency_requests er
       WHERE (er.agency_id = $1 OR er.agency_id IS NULL)`,
      [agencyId],
    );

    return {
      data: incidents.map(this.formatIncidentSummary),
      meta: {
        total: parseInt(countResult?.count || '0'),
        limit,
        offset,
      },
    };
  }

  async getIncidentDetails(agencyId: string, incidentId: string) {
    const incident = await this.db.queryOne(
      `SELECT er.*,
              u.call_sign as unit_call_sign,
              u.status as unit_status,
              u.phone_number as unit_phone,
              caller.full_name as caller_full_name,
              caller.kyc_status as caller_kyc
       FROM emergency_requests er
       LEFT JOIN units u ON er.primary_unit_id = u.id
       LEFT JOIN users caller ON er.caller_id = caller.id
       WHERE er.id = $1`,
      [incidentId],
    );

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    // Get assignments
    const assignments = await this.db.queryMany(
      `SELECT ua.*, u.call_sign, u.unit_type, u.phone_number,
              u.current_latitude, u.current_longitude
       FROM unit_assignments ua
       JOIN units u ON ua.unit_id = u.id
       WHERE ua.incident_id = $1
       ORDER BY ua.created_at DESC`,
      [incidentId],
    );

    // Get latest location
    const latestLocation = await this.db.queryOne(
      `SELECT * FROM location_snapshots
       WHERE incident_id = $1
       ORDER BY captured_at DESC
       LIMIT 1`,
      [incidentId],
    );

    // Get emergency contacts if available
    let emergencyContacts: any[] = [];
    if (incident.caller_id) {
      emergencyContacts = await this.db.queryMany(
        `SELECT * FROM emergency_contacts WHERE user_id = $1 ORDER BY is_primary DESC`,
        [incident.caller_id],
      );
    }

    return {
      ...this.formatIncidentDetails(incident),
      assignments: assignments.map(this.formatAssignment),
      latestLocation: latestLocation
        ? {
            latitude: parseFloat(latestLocation.latitude),
            longitude: parseFloat(latestLocation.longitude),
            accuracy: latestLocation.accuracy ? parseFloat(latestLocation.accuracy) : null,
            confidence: latestLocation.confidence,
            capturedAt: latestLocation.captured_at,
          }
        : null,
      emergencyContacts: emergencyContacts.map((c) => ({
        id: c.id,
        name: c.name,
        phoneNumber: c.phone_number,
        relationship: c.relationship,
        isPrimary: c.is_primary,
      })),
    };
  }

  async acknowledgeIncident(
    user: AuthenticatedUser,
    incidentId: string,
    dto: AcknowledgeIncidentDto,
  ) {
    const incident = await this.db.queryOne(
      `SELECT * FROM emergency_requests WHERE id = $1`,
      [incidentId],
    );

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    await this.db.transaction(async (client) => {
      // Update incident
      await client.query(
        `UPDATE emergency_requests SET
          status = $1,
          agency_id = $2,
          acknowledged_at = NOW(),
          updated_at = NOW()
         WHERE id = $3`,
        [IncidentStatus.ACKNOWLEDGED, user.agencyId, incidentId],
      );

      // Add notes if provided
      if (dto.notes) {
        await client.query(
          `UPDATE emergency_requests SET dispatcher_notes = $1 WHERE id = $2`,
          [dto.notes, incidentId],
        );
      }

      // Create audit event
      await client.query(
        `INSERT INTO incident_events (incident_id, event_type, actor_id, actor_role, metadata)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          incidentId,
          IncidentEventType.ACKNOWLEDGED,
          user.id,
          user.appRole,
          JSON.stringify({ agencyId: user.agencyId }),
        ],
      );
    });

    // Trigger auto-dispatch if enabled
    if (dto.autoDispatch !== false) {
      await this.dispatchService.dispatchIncident(incidentId, incident.priority, user.id);
    }

    this.realtimeGateway.emitToIncident(incidentId, 'incident:acknowledged', {
      incidentId,
      dispatcherId: user.id,
    });

    return { success: true, status: IncidentStatus.ACKNOWLEDGED };
  }

  async updateIncidentStatus(
    user: AuthenticatedUser,
    incidentId: string,
    dto: UpdateIncidentStatusDto,
  ) {
    await this.db.transaction(async (client) => {
      const updateFields: string[] = ['status = $1', 'updated_at = NOW()'];
      const params: any[] = [dto.status, incidentId];

      if (dto.status === IncidentStatus.RESOLVED) {
        updateFields.push('resolved_at = NOW()');
      }

      await client.query(
        `UPDATE emergency_requests SET ${updateFields.join(', ')} WHERE id = $${params.length}`,
        params,
      );

      await client.query(
        `INSERT INTO incident_events (incident_id, event_type, actor_id, actor_role, metadata)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          incidentId,
          IncidentEventType.STATUS_CHANGED,
          user.id,
          user.appRole,
          JSON.stringify({ newStatus: dto.status, reason: dto.reason }),
        ],
      );
    });

    this.realtimeGateway.emitToIncident(incidentId, 'incident:updated', {
      incidentId,
      status: dto.status,
    });

    return { success: true, status: dto.status };
  }

  async addNotes(user: AuthenticatedUser, incidentId: string, notes: string) {
    await this.db.transaction(async (client) => {
      await client.query(
        `UPDATE emergency_requests SET
          dispatcher_notes = COALESCE(dispatcher_notes, '') || E'\n' || $1,
          updated_at = NOW()
         WHERE id = $2`,
        [`[${new Date().toISOString()}] ${notes}`, incidentId],
      );

      await client.query(
        `INSERT INTO incident_events (incident_id, event_type, actor_id, actor_role, metadata)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          incidentId,
          IncidentEventType.NOTE_ADDED,
          user.id,
          user.appRole,
          JSON.stringify({ note: notes }),
        ],
      );
    });

    return { success: true };
  }

  async assignUnit(user: AuthenticatedUser, incidentId: string, dto: AssignUnitDto) {
    // Verify unit belongs to agency
    const unit = await this.db.queryOne(
      `SELECT * FROM units WHERE id = $1 AND agency_id = $2`,
      [dto.unitId, user.agencyId],
    );

    if (!unit) {
      throw new NotFoundException('Unit not found in your agency');
    }

    const incident = await this.db.queryOne(
      `SELECT * FROM emergency_requests WHERE id = $1`,
      [incidentId],
    );

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    await this.dispatchService.createAssignmentOffer(
      incidentId,
      dto.unitId,
      90, // 90 second timeout
      user.id,
      dto.isPrimary ?? true,
    );

    return { success: true };
  }

  async sendMessage(user: AuthenticatedUser, incidentId: string, dto: SendMessageDto) {
    await this.notificationsService.sendNotification({
      incidentId,
      recipientPhone: dto.recipientPhone,
      channel: dto.channel,
      messageType: 'dispatcher_message',
      messageContent: dto.message,
    });

    await this.db.query(
      `INSERT INTO incident_events (incident_id, event_type, actor_id, actor_role, metadata)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        incidentId,
        IncidentEventType.MESSAGE_SENT,
        user.id,
        user.appRole,
        JSON.stringify({ recipient: dto.recipientPhone, channel: dto.channel }),
      ],
    );

    return { success: true };
  }

  async getIncidentTimeline(incidentId: string) {
    const events = await this.db.queryMany(
      `SELECT ie.*, u.full_name as actor_name, un.call_sign as unit_call_sign
       FROM incident_events ie
       LEFT JOIN users u ON ie.actor_id = u.id
       LEFT JOIN units un ON ie.actor_unit_id = un.id
       WHERE ie.incident_id = $1
       ORDER BY ie.created_at DESC`,
      [incidentId],
    );

    return events.map((e) => ({
      id: e.id,
      eventType: e.event_type,
      actorName: e.actor_name || e.unit_call_sign || 'System',
      actorRole: e.actor_role,
      metadata: e.metadata,
      description: e.description,
      createdAt: e.created_at,
    }));
  }

  async getLocationHistory(incidentId: string) {
    const locations = await this.db.queryMany(
      `SELECT * FROM location_snapshots
       WHERE incident_id = $1
       ORDER BY captured_at DESC
       LIMIT 100`,
      [incidentId],
    );

    return locations.map((l) => ({
      id: l.id,
      latitude: parseFloat(l.latitude),
      longitude: parseFloat(l.longitude),
      accuracy: l.accuracy ? parseFloat(l.accuracy) : null,
      source: l.source,
      confidence: l.confidence,
      capturedAt: l.captured_at,
    }));
  }

  async getDeliveryLogs(incidentId: string) {
    const logs = await this.db.queryMany(
      `SELECT * FROM delivery_logs
       WHERE incident_id = $1
       ORDER BY created_at DESC`,
      [incidentId],
    );

    return logs.map((l) => ({
      id: l.id,
      channel: l.channel,
      recipientPhone: l.recipient_phone,
      recipientName: l.recipient_name,
      messageType: l.message_type,
      status: l.status,
      attemptCount: l.attempt_count,
      sentAt: l.sent_at,
      deliveredAt: l.delivered_at,
      failedAt: l.failed_at,
      errorMessage: l.error_message,
      createdAt: l.created_at,
    }));
  }

  async getAgencyUnits(agencyId: string, status?: string) {
    let query = `
      SELECT u.*,
             (SELECT COUNT(*) FROM unit_assignments ua
              WHERE ua.unit_id = u.id AND ua.status IN ('offered', 'accepted')) as active_assignments
      FROM units u
      WHERE u.agency_id = $1
    `;

    const params: any[] = [agencyId];

    if (status) {
      query += ` AND u.status = $2`;
      params.push(status);
    }

    query += ` ORDER BY u.status, u.call_sign`;

    const units = await this.db.queryMany(query, params);

    return units.map((u) => ({
      id: u.id,
      callSign: u.call_sign,
      unitType: u.unit_type,
      status: u.status,
      isOnDuty: u.is_on_duty,
      phoneNumber: u.phone_number,
      activeAssignments: parseInt(u.active_assignments),
      currentLocation: u.current_latitude
        ? {
            latitude: parseFloat(u.current_latitude),
            longitude: parseFloat(u.current_longitude),
          }
        : null,
      lastLocationAt: u.last_location_at,
    }));
  }

  async updateUnitStatus(user: AuthenticatedUser, unitId: string, status: string) {
    await this.db.query(
      `UPDATE units SET status = $1, updated_at = NOW() WHERE id = $2 AND agency_id = $3`,
      [status, unitId, user.agencyId],
    );

    this.realtimeGateway.emitToAgency(user.agencyId!, 'unit:status_changed', {
      unitId,
      status,
      updatedBy: user.id,
    });

    return { success: true };
  }

  async getIncidentReport(agencyId: string, startDate: string, endDate: string, format: string) {
    const incidents = await this.db.queryMany(
      `SELECT er.*, u.call_sign as responding_unit
       FROM emergency_requests er
       LEFT JOIN units u ON er.primary_unit_id = u.id
       WHERE er.agency_id = $1
         AND er.created_at >= $2
         AND er.created_at <= $3
       ORDER BY er.created_at DESC`,
      [agencyId, startDate, endDate],
    );

    const summary = await this.db.queryOne(
      `SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'resolved') as resolved,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
        AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/60) FILTER (WHERE resolved_at IS NOT NULL) as avg_resolution_minutes
       FROM emergency_requests
       WHERE agency_id = $1
         AND created_at >= $2
         AND created_at <= $3`,
      [agencyId, startDate, endDate],
    );

    return {
      summary: {
        total: parseInt(summary?.total || '0'),
        resolved: parseInt(summary?.resolved || '0'),
        cancelled: parseInt(summary?.cancelled || '0'),
        averageResolutionMinutes: summary?.avg_resolution_minutes
          ? Math.round(parseFloat(summary.avg_resolution_minutes))
          : null,
      },
      incidents: incidents.map(this.formatIncidentSummary),
    };
  }

  async getDashboardStats(agencyId: string) {
    const stats = await this.db.queryOne(
      `SELECT
        (SELECT COUNT(*) FROM emergency_requests WHERE agency_id = $1 AND status = 'pending') as pending,
        (SELECT COUNT(*) FROM emergency_requests WHERE agency_id = $1 AND status IN ('acknowledged', 'dispatched', 'en_route', 'on_scene')) as active,
        (SELECT COUNT(*) FROM emergency_requests WHERE agency_id = $1 AND DATE(created_at) = CURRENT_DATE) as today_total,
        (SELECT COUNT(*) FROM emergency_requests WHERE agency_id = $1 AND DATE(resolved_at) = CURRENT_DATE) as today_resolved,
        (SELECT COUNT(*) FROM units WHERE agency_id = $1 AND status = 'available' AND is_on_duty = true) as units_available,
        (SELECT COUNT(*) FROM units WHERE agency_id = $1 AND status = 'busy') as units_busy,
        (SELECT COUNT(*) FROM units WHERE agency_id = $1) as units_total`,
      [agencyId],
    );

    return {
      incidents: {
        pending: parseInt(stats?.pending || '0'),
        active: parseInt(stats?.active || '0'),
        todayTotal: parseInt(stats?.today_total || '0'),
        todayResolved: parseInt(stats?.today_resolved || '0'),
      },
      units: {
        available: parseInt(stats?.units_available || '0'),
        busy: parseInt(stats?.units_busy || '0'),
        total: parseInt(stats?.units_total || '0'),
      },
    };
  }

  private formatIncidentSummary(incident: any) {
    return {
      id: incident.id,
      emergencyType: incident.emergency_type,
      status: incident.status,
      priority: incident.priority,
      callerPhone: incident.caller_phone,
      callerName: incident.caller_name,
      callerVerified: incident.caller_verified,
      locationConfidence: incident.location_confidence,
      latitude: incident.latitude ? parseFloat(incident.latitude) : null,
      longitude: incident.longitude ? parseFloat(incident.longitude) : null,
      landmark: incident.landmark,
      intakeSource: incident.intake_source,
      unitCallSign: incident.unit_call_sign,
      unitStatus: incident.unit_status,
      escalationLevel: incident.escalation_level,
      createdAt: incident.created_at,
      acknowledgedAt: incident.acknowledged_at,
      eventCount: incident.event_count ? parseInt(incident.event_count) : 0,
      lastEventAt: incident.last_event_at,
    };
  }

  private formatIncidentDetails(incident: any) {
    return {
      ...this.formatIncidentSummary(incident),
      callerId: incident.caller_id,
      callerKyc: incident.caller_kyc,
      callerFullName: incident.caller_full_name,
      accuracy: incident.accuracy ? parseFloat(incident.accuracy) : null,
      description: incident.description,
      notes: incident.dispatcher_notes,
      trackingToken: incident.tracking_token,
      trackingExpiresAt: incident.tracking_expires_at,
      agencyId: incident.agency_id,
      primaryUnitId: incident.primary_unit_id,
      unitPhone: incident.unit_phone,
      dispatchedAt: incident.dispatched_at,
      resolvedAt: incident.resolved_at,
      cancelledAt: incident.cancelled_at,
    };
  }

  private formatAssignment(assignment: any) {
    return {
      id: assignment.id,
      unitId: assignment.unit_id,
      callSign: assignment.call_sign,
      unitType: assignment.unit_type,
      phoneNumber: assignment.phone_number,
      status: assignment.status,
      offeredAt: assignment.offered_at,
      respondedAt: assignment.responded_at,
      declineReason: assignment.decline_reason,
      isPrimary: assignment.is_primary,
      unitLocation: assignment.current_latitude
        ? {
            latitude: parseFloat(assignment.current_latitude),
            longitude: parseFloat(assignment.current_longitude),
          }
        : null,
    };
  }
}
