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
exports.UnitsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/database.service");
const dispatch_service_1 = require("../dispatch/dispatch.service");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const shared_1 = require("@safepulse/shared");
let UnitsService = class UnitsService {
    constructor(db, dispatchService, realtimeGateway) {
        this.db = db;
        this.dispatchService = dispatchService;
        this.realtimeGateway = realtimeGateway;
    }
    async getUnitByUserId(userId) {
        const unit = await this.db.queryOne(`SELECT u.*, a.name as agency_name, a.type as agency_type
       FROM units u
       JOIN agencies a ON u.agency_id = a.id
       WHERE u.assigned_user_id = $1`, [userId]);
        if (!unit) {
            throw new common_1.NotFoundException('Unit not found for this user');
        }
        return this.formatUnit(unit);
    }
    async getUnitById(unitId) {
        const unit = await this.db.queryOne(`SELECT u.*, a.name as agency_name
       FROM units u
       JOIN agencies a ON u.agency_id = a.id
       WHERE u.id = $1`, [unitId]);
        if (!unit) {
            throw new common_1.NotFoundException('Unit not found');
        }
        return this.formatUnit(unit);
    }
    async updateUnitStatus(unitId, dto) {
        const unit = await this.db.mutateOne(`UPDATE units SET
        status = $1,
        is_on_duty = $2,
        updated_at = NOW()
       WHERE id = $3
       RETURNING *`, [dto.status, dto.isOnDuty ?? true, unitId]);
        if (!unit) {
            throw new common_1.NotFoundException('Unit not found');
        }
        this.realtimeGateway.emitToAgency(unit.agency_id, 'unit:status_changed', {
            unitId,
            status: dto.status,
            isOnDuty: dto.isOnDuty,
        });
        return { success: true, status: dto.status };
    }
    async updateUnitLocation(unitId, dto) {
        await this.db.query(`UPDATE units SET
        current_latitude = $1,
        current_longitude = $2,
        current_accuracy = $3,
        last_location_at = NOW(),
        updated_at = NOW()
       WHERE id = $4`, [dto.latitude, dto.longitude, dto.accuracy, unitId]);
        return { success: true };
    }
    async getUnitAssignments(unitId, activeOnly) {
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
    async acceptAssignment(unitId, assignmentId) {
        await this.dispatchService.acceptAssignment(assignmentId, unitId);
        return { success: true };
    }
    async declineAssignment(unitId, assignmentId, reason) {
        await this.dispatchService.declineAssignment(assignmentId, unitId, reason);
        return { success: true };
    }
    async getAssignmentDetails(unitId, assignmentId) {
        const assignment = await this.db.queryOne(`SELECT ua.*, er.*,
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
       WHERE ua.id = $1 AND ua.unit_id = $2`, [assignmentId, unitId]);
        if (!assignment) {
            throw new common_1.NotFoundException('Assignment not found');
        }
        return this.formatAssignmentDetails(assignment);
    }
    async updateIncidentStatus(unitId, incidentId, dto) {
        const assignment = await this.db.queryOne(`SELECT * FROM unit_assignments
       WHERE unit_id = $1 AND incident_id = $2 AND status = 'accepted'`, [unitId, incidentId]);
        if (!assignment) {
            throw new common_1.ForbiddenException('Not assigned to this incident');
        }
        const validStatuses = [shared_1.IncidentStatus.EN_ROUTE, shared_1.IncidentStatus.ON_SCENE];
        if (!validStatuses.includes(dto.status)) {
            throw new common_1.BadRequestException('Invalid status for unit update');
        }
        await this.db.transaction(async (client) => {
            await client.query(`UPDATE emergency_requests SET status = $1, updated_at = NOW() WHERE id = $2`, [dto.status, incidentId]);
            const eventType = dto.status === shared_1.IncidentStatus.EN_ROUTE
                ? shared_1.IncidentEventType.UNIT_EN_ROUTE
                : shared_1.IncidentEventType.UNIT_ON_SCENE;
            await client.query(`INSERT INTO incident_events (incident_id, event_type, actor_unit_id, metadata)
         VALUES ($1, $2, $3, $4)`, [incidentId, eventType, unitId, JSON.stringify({ notes: dto.notes })]);
        });
        this.realtimeGateway.emitToIncident(incidentId, 'incident:updated', {
            incidentId,
            status: dto.status,
            unitId,
        });
        return { success: true, status: dto.status };
    }
    async recordLocationPing(unitId, incidentId, dto) {
        const assignment = await this.db.queryOne(`SELECT id FROM unit_assignments
       WHERE unit_id = $1 AND incident_id = $2 AND status = 'accepted'`, [unitId, incidentId]);
        if (!assignment) {
            throw new common_1.ForbiddenException('Not assigned to this incident');
        }
        await this.db.query(`INSERT INTO unit_location_pings (
        unit_id, incident_id, assignment_id,
        latitude, longitude, accuracy, heading, speed, captured_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`, [
            unitId,
            incidentId,
            assignment.id,
            dto.latitude,
            dto.longitude,
            dto.accuracy,
            dto.heading,
            dto.speed,
        ]);
        await this.updateUnitLocation(unitId, dto);
        this.realtimeGateway.emitToIncident(incidentId, 'unit_location:updated', {
            unitId,
            latitude: dto.latitude,
            longitude: dto.longitude,
            heading: dto.heading,
        });
        return { success: true };
    }
    async resolveIncident(unitId, incidentId, notes) {
        const assignment = await this.db.queryOne(`SELECT * FROM unit_assignments
       WHERE unit_id = $1 AND incident_id = $2 AND status = 'accepted'`, [unitId, incidentId]);
        if (!assignment) {
            throw new common_1.ForbiddenException('Not assigned to this incident');
        }
        await this.db.transaction(async (client) => {
            await client.query(`UPDATE emergency_requests SET
          status = $1, resolved_at = NOW(), updated_at = NOW()
         WHERE id = $2`, [shared_1.IncidentStatus.RESOLVED, incidentId]);
            await client.query(`UPDATE unit_assignments SET status = 'completed' WHERE id = $1`, [assignment.id]);
            await client.query(`UPDATE units SET status = $1 WHERE id = $2`, [
                shared_1.UnitStatus.AVAILABLE,
                unitId,
            ]);
            await client.query(`INSERT INTO incident_events (incident_id, event_type, actor_unit_id, metadata)
         VALUES ($1, $2, $3, $4)`, [incidentId, shared_1.IncidentEventType.RESOLVED, unitId, JSON.stringify({ notes, resolvedBy: 'unit' })]);
        });
        this.realtimeGateway.emitToIncident(incidentId, 'incident:resolved', { incidentId, unitId });
        return { success: true, status: shared_1.IncidentStatus.RESOLVED };
    }
    async requestBackup(unitId, incidentId, notes) {
        const assignment = await this.db.queryOne(`SELECT ua.*, er.agency_id, er.emergency_type, er.latitude, er.longitude
       FROM unit_assignments ua
       JOIN emergency_requests er ON ua.incident_id = er.id
       WHERE ua.unit_id = $1 AND ua.incident_id = $2 AND ua.status = 'accepted'`, [unitId, incidentId]);
        if (!assignment) {
            throw new common_1.ForbiddenException('Not assigned to this incident');
        }
        await this.db.query(`INSERT INTO incident_events (incident_id, event_type, actor_unit_id, metadata)
       VALUES ($1, $2, $3, $4)`, [incidentId, shared_1.IncidentEventType.BACKUP_REQUESTED, unitId, JSON.stringify({ notes })]);
        this.realtimeGateway.emitToAgency(assignment.agency_id, 'backup:requested', {
            incidentId,
            unitId,
            notes,
        });
        await this.dispatchService.dispatchIncident(incidentId);
        return { success: true };
    }
    async reportCantLocate(unitId, incidentId, notes) {
        const assignment = await this.db.queryOne(`SELECT * FROM unit_assignments
       WHERE unit_id = $1 AND incident_id = $2 AND status = 'accepted'`, [unitId, incidentId]);
        if (!assignment) {
            throw new common_1.ForbiddenException('Not assigned to this incident');
        }
        await this.db.query(`INSERT INTO incident_events (incident_id, event_type, actor_unit_id, metadata)
       VALUES ($1, $2, $3, $4)`, [incidentId, shared_1.IncidentEventType.CANT_LOCATE, unitId, JSON.stringify({ notes })]);
        const incident = await this.db.queryOne(`SELECT agency_id FROM emergency_requests WHERE id = $1`, [incidentId]);
        if (incident?.agency_id) {
            this.realtimeGateway.emitToAgency(incident.agency_id, 'incident:cant_locate', {
                incidentId,
                unitId,
                notes,
            });
        }
        return { success: true };
    }
    async getAssignmentHistory(unitId, limit, offset) {
        const assignments = await this.db.queryMany(`SELECT ua.*, er.emergency_type, er.status as incident_status,
              er.priority, er.created_at as incident_created_at, er.resolved_at
       FROM unit_assignments ua
       JOIN emergency_requests er ON ua.incident_id = er.id
       WHERE ua.unit_id = $1
       ORDER BY ua.created_at DESC
       LIMIT $2 OFFSET $3`, [unitId, limit, offset]);
        return assignments.map(this.formatAssignment);
    }
    formatUnit(unit) {
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
    formatAssignment(assignment) {
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
    formatAssignmentDetails(assignment) {
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
};
exports.UnitsService = UnitsService;
exports.UnitsService = UnitsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => dispatch_service_1.DispatchService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => realtime_gateway_1.RealtimeGateway))),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        dispatch_service_1.DispatchService,
        realtime_gateway_1.RealtimeGateway])
], UnitsService);
//# sourceMappingURL=units.service.js.map