"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/database.service");
const queue_service_1 = require("../../queue/queue.service");
const shared_1 = require("@safepulse/shared");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
let DispatchService = class DispatchService {
    constructor(db, queueService, realtimeGateway) {
        this.db = db;
        this.queueService = queueService;
        this.realtimeGateway = realtimeGateway;
    }
    async findAvailableUnits(emergencyType, latitude, longitude, agencyId, limit = 10) {
        const unitTypes = shared_1.EmergencyRouting[emergencyType];
        const units = await this.db.queryMany(`SELECT
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
      LIMIT $4`, agencyId
            ? [latitude, longitude, unitTypes, limit, agencyId]
            : [latitude, longitude, unitTypes, limit]);
        return units;
    }
    async dispatchIncident(incidentId, priority = shared_1.IncidentPriority.NORMAL, assignedBy) {
        const incident = await this.db.queryOne(`SELECT * FROM emergency_requests WHERE id = $1`, [incidentId]);
        if (!incident) {
            throw new common_1.BadRequestException('Incident not found');
        }
        if (!incident.latitude || !incident.longitude) {
            return;
        }
        const config = priority === shared_1.IncidentPriority.HIGH || priority === shared_1.IncidentPriority.CRITICAL
            ? shared_1.DispatchConfig.high
            : shared_1.DispatchConfig.normal;
        const units = await this.findAvailableUnits(incident.emergency_type, parseFloat(incident.latitude), parseFloat(incident.longitude), incident.agency_id, config.offerCount);
        if (units.length === 0) {
            await this.scheduleEscalation(incidentId, config.escalationMinutes);
            return;
        }
        if (config.offerStrategy === 'parallel') {
            await this.createParallelOffers(incidentId, units, config.offerTimeoutSeconds, assignedBy);
        }
        else {
            await this.createSequentialOffer(incidentId, units[0], config.offerTimeoutSeconds, assignedBy);
        }
        await this.db.query(`UPDATE emergency_requests SET status = $1, dispatched_at = NOW() WHERE id = $2`, [shared_1.IncidentStatus.DISPATCHED, incidentId]);
    }
    async createAssignmentOffer(incidentId, unitId, timeoutSeconds, assignedBy, isPrimary = false) {
        const expiresAt = new Date(Date.now() + timeoutSeconds * 1000);
        const assignment = await this.db.mutateOne(`INSERT INTO unit_assignments (
        incident_id, unit_id, status, expires_at, assigned_by, is_primary
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id`, [incidentId, unitId, shared_1.AssignmentStatus.OFFERED, expiresAt, assignedBy, isPrimary]);
        await this.db.query(`UPDATE units SET status = $1 WHERE id = $2`, [shared_1.UnitStatus.BUSY, unitId]);
        await this.queueService.scheduleOfferTimeout(assignment.id, timeoutSeconds * 1000);
        await this.db.query(`INSERT INTO incident_events (incident_id, event_type, actor_id, metadata)
       VALUES ($1, $2, $3, $4)`, [
            incidentId,
            shared_1.IncidentEventType.UNIT_ASSIGNED,
            assignedBy,
            JSON.stringify({ unitId, assignmentId: assignment.id }),
        ]);
        await this.notifyUnitOfOffer(unitId, incidentId, assignment.id);
        return assignment.id;
    }
    async createParallelOffers(incidentId, units, timeoutSeconds, assignedBy) {
        const promises = units.map((unit, index) => this.createAssignmentOffer(incidentId, unit.id, timeoutSeconds, assignedBy, index === 0));
        await Promise.all(promises);
    }
    async createSequentialOffer(incidentId, unit, timeoutSeconds, assignedBy) {
        await this.createAssignmentOffer(incidentId, unit.id, timeoutSeconds, assignedBy, true);
    }
    async acceptAssignment(assignmentId, unitId) {
        const assignment = await this.db.queryOne(`SELECT * FROM unit_assignments WHERE id = $1 AND unit_id = $2`, [assignmentId, unitId]);
        if (!assignment) {
            throw new common_1.BadRequestException('Assignment not found');
        }
        if (assignment.status !== shared_1.AssignmentStatus.OFFERED) {
            throw new common_1.BadRequestException('Assignment already responded to');
        }
        if (new Date(assignment.expires_at) < new Date()) {
            throw new common_1.BadRequestException('Assignment offer has expired');
        }
        await this.db.transaction(async (client) => {
            await client.query(`UPDATE unit_assignments SET
          status = $1, responded_at = NOW(), is_primary = true
         WHERE id = $2`, [shared_1.AssignmentStatus.ACCEPTED, assignmentId]);
            await client.query(`UPDATE unit_assignments SET status = $1
         WHERE incident_id = $2 AND id != $3 AND status = $4`, [shared_1.AssignmentStatus.CANCELLED, assignment.incident_id, assignmentId, shared_1.AssignmentStatus.OFFERED]);
            await client.query(`UPDATE emergency_requests SET
          primary_unit_id = $1, status = $2
         WHERE id = $3`, [unitId, shared_1.IncidentStatus.DISPATCHED, assignment.incident_id]);
            await client.query(`INSERT INTO incident_events (incident_id, event_type, actor_unit_id, metadata)
         VALUES ($1, $2, $3, $4)`, [
                assignment.incident_id,
                shared_1.IncidentEventType.UNIT_ACCEPTED,
                unitId,
                JSON.stringify({ assignmentId }),
            ]);
        });
        await this.queueService.cancelOfferTimeout(assignmentId);
        await this.queueService.scheduleEnRouteCheck(assignmentId, assignment.incident_id, shared_1.DispatchConfig.enRouteCheckMinutes * 60 * 1000);
        this.realtimeGateway.emitToIncident(assignment.incident_id, 'assignment:accepted', {
            assignmentId,
            unitId,
        });
    }
    async declineAssignment(assignmentId, unitId, reason) {
        const assignment = await this.db.queryOne(`SELECT * FROM unit_assignments WHERE id = $1 AND unit_id = $2`, [assignmentId, unitId]);
        if (!assignment) {
            throw new common_1.BadRequestException('Assignment not found');
        }
        if (assignment.status !== shared_1.AssignmentStatus.OFFERED) {
            throw new common_1.BadRequestException('Assignment already responded to');
        }
        await this.db.transaction(async (client) => {
            await client.query(`UPDATE unit_assignments SET
          status = $1, responded_at = NOW(), decline_reason = $2
         WHERE id = $3`, [shared_1.AssignmentStatus.DECLINED, reason, assignmentId]);
            await client.query(`UPDATE units SET status = $1 WHERE id = $2`, [shared_1.UnitStatus.AVAILABLE, unitId]);
            await client.query(`INSERT INTO incident_events (incident_id, event_type, actor_unit_id, metadata)
         VALUES ($1, $2, $3, $4)`, [
                assignment.incident_id,
                shared_1.IncidentEventType.UNIT_DECLINED,
                unitId,
                JSON.stringify({ assignmentId, reason }),
            ]);
        });
        await this.queueService.cancelOfferTimeout(assignmentId);
        await this.offerToNextUnit(assignment.incident_id);
    }
    async handleOfferTimeout(assignmentId) {
        const assignment = await this.db.queryOne(`SELECT * FROM unit_assignments WHERE id = $1`, [assignmentId]);
        if (!assignment || assignment.status !== shared_1.AssignmentStatus.OFFERED) {
            return;
        }
        await this.db.transaction(async (client) => {
            await client.query(`UPDATE unit_assignments SET status = $1 WHERE id = $2`, [shared_1.AssignmentStatus.EXPIRED, assignmentId]);
            await client.query(`UPDATE units SET status = $1 WHERE id = $2`, [
                shared_1.UnitStatus.AVAILABLE,
                assignment.unit_id,
            ]);
        });
        await this.offerToNextUnit(assignment.incident_id);
    }
    async offerToNextUnit(incidentId) {
        const incident = await this.db.queryOne(`SELECT * FROM emergency_requests WHERE id = $1`, [incidentId]);
        if (!incident || incident.status === shared_1.IncidentStatus.RESOLVED || incident.status === shared_1.IncidentStatus.CANCELLED) {
            return;
        }
        const units = await this.db.queryMany(`SELECT
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
      LIMIT 1`, [parseFloat(incident.latitude), parseFloat(incident.longitude), incidentId]);
        if (units.length > 0) {
            await this.createAssignmentOffer(incidentId, units[0].id, shared_1.DispatchConfig.normal.offerTimeoutSeconds);
        }
        else {
            await this.scheduleEscalation(incidentId, 1);
        }
    }
    async scheduleEscalation(incidentId, delayMinutes) {
        await this.queueService.scheduleEscalation(incidentId, delayMinutes * 60 * 1000);
    }
    async handleEscalation(incidentId) {
        const incident = await this.db.queryOne(`SELECT * FROM emergency_requests WHERE id = $1`, [incidentId]);
        if (!incident || incident.status === shared_1.IncidentStatus.RESOLVED || incident.status === shared_1.IncidentStatus.CANCELLED) {
            return;
        }
        await this.db.query(`UPDATE emergency_requests SET
        escalation_level = escalation_level + 1,
        last_escalated_at = NOW()
       WHERE id = $1`, [incidentId]);
        await this.db.query(`INSERT INTO incident_events (incident_id, event_type, metadata)
       VALUES ($1, $2, $3)`, [
            incidentId,
            shared_1.IncidentEventType.ESCALATED,
            JSON.stringify({ level: incident.escalation_level + 1 }),
        ]);
        if (incident.agency_id) {
            this.realtimeGateway.emitToAgency(incident.agency_id, 'escalation:alert', {
                incidentId,
                escalationLevel: incident.escalation_level + 1,
            });
        }
        const expandedUnits = await this.db.queryMany(`SELECT
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
      LIMIT 3`, [parseFloat(incident.latitude), parseFloat(incident.longitude), incidentId]);
        if (expandedUnits.length > 0) {
            await this.createParallelOffers(incidentId, expandedUnits, shared_1.DispatchConfig.high.offerTimeoutSeconds);
        }
    }
    async notifyUnitOfOffer(unitId, incidentId, assignmentId) {
        const incident = await this.db.queryOne(`SELECT er.*, ls.latitude as loc_lat, ls.longitude as loc_lng, ls.accuracy as loc_accuracy
       FROM emergency_requests er
       LEFT JOIN location_snapshots ls ON ls.incident_id = er.id
       WHERE er.id = $1
       ORDER BY ls.captured_at DESC
       LIMIT 1`, [incidentId]);
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
};
exports.DispatchService = DispatchService;
exports.DispatchService = DispatchService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => realtime_gateway_1.RealtimeGateway))),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        queue_service_1.QueueService,
        realtime_gateway_1.RealtimeGateway])
], DispatchService);
//# sourceMappingURL=dispatch.service.js.map