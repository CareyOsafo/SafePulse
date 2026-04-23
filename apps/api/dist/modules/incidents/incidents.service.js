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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentsService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const database_service_1 = require("../../database/database.service");
const shared_1 = require("@safepulse/shared");
let IncidentsService = class IncidentsService {
    constructor(db) {
        this.db = db;
    }
    async createIncident(user, dto, idempotencyKey) {
        const userKyc = await this.db.queryOne('SELECT kyc_status FROM users WHERE id = $1', [user.id]);
        if (userKyc?.kyc_status === shared_1.KycStatus.FAILED) {
            throw new common_1.ForbiddenException({
                code: 'KYC_FAILED',
                message: 'Your identity verification failed. Please retry verification.',
            });
        }
        if (idempotencyKey) {
            const existing = await this.db.queryOne('SELECT id, status FROM emergency_requests WHERE idempotency_key = $1', [idempotencyKey]);
            if (existing) {
                return this.getIncidentById(existing.id);
            }
        }
        const trackingToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const trackingExpiresAt = new Date(Date.now() + shared_1.DispatchConfig.trackingTokenExpiryHours * 60 * 60 * 1000);
        const confidence = this.calculateConfidence(dto.location);
        const incident = await this.db.transaction(async (client) => {
            const result = await client.query(`INSERT INTO emergency_requests (
          caller_id, caller_phone, caller_name,
          emergency_type, status, priority,
          intake_source, location_source, location_confidence,
          latitude, longitude, accuracy, landmark,
          tracking_token, tracking_expires_at,
          caller_kyc_status, caller_verified,
          idempotency_key
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          $10, $11, $12, $13, $14, $15, $16, $17, $18
        ) RETURNING *`, [
                user.id,
                user.phoneNumber,
                user.fullName,
                dto.emergencyType,
                shared_1.IncidentStatus.PENDING,
                dto.priority || 'normal',
                'app',
                dto.location.source,
                confidence,
                dto.location.coordinates.latitude,
                dto.location.coordinates.longitude,
                dto.location.coordinates.accuracy,
                dto.location.landmark,
                trackingToken,
                trackingExpiresAt,
                userKyc?.kyc_status || shared_1.KycStatus.NOT_STARTED,
                userKyc?.kyc_status === shared_1.KycStatus.VERIFIED,
                idempotencyKey,
            ]);
            const newIncident = result.rows[0];
            await client.query(`INSERT INTO location_snapshots (
          incident_id, latitude, longitude, accuracy,
          source, confidence, captured_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
                newIncident.id,
                dto.location.coordinates.latitude,
                dto.location.coordinates.longitude,
                dto.location.coordinates.accuracy,
                dto.location.source,
                confidence,
                dto.location.timestamp || new Date(),
            ]);
            await client.query(`INSERT INTO incident_events (
          incident_id, event_type, actor_id, actor_role, metadata
        ) VALUES ($1, $2, $3, $4, $5)`, [
                newIncident.id,
                shared_1.IncidentEventType.CREATED,
                user.id,
                user.appRole,
                JSON.stringify({
                    emergencyType: dto.emergencyType,
                    intakeSource: 'app',
                    locationSource: dto.location.source,
                }),
            ]);
            return newIncident;
        });
        return {
            id: incident.id,
            status: incident.status,
            trackingToken: incident.tracking_token,
            emergencyType: incident.emergency_type,
            createdAt: incident.created_at,
        };
    }
    async updateLocation(user, incidentId, dto) {
        const incident = await this.db.queryOne(`SELECT id, caller_id, status FROM emergency_requests
       WHERE id = $1 AND status NOT IN ('resolved', 'cancelled', 'closed')`, [incidentId]);
        if (!incident) {
            throw new common_1.NotFoundException('Incident not found or already closed');
        }
        if (incident.caller_id !== user.id) {
            throw new common_1.ForbiddenException('Not authorized to update this incident');
        }
        const confidence = this.calculateConfidence({
            coordinates: dto.coordinates,
            source: dto.source || shared_1.LocationSource.GPS,
        });
        await this.db.query(`INSERT INTO location_snapshots (
        incident_id, latitude, longitude, accuracy,
        altitude, heading, speed, source, confidence, captured_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`, [
            incidentId,
            dto.coordinates.latitude,
            dto.coordinates.longitude,
            dto.coordinates.accuracy,
            dto.coordinates.altitude,
            dto.coordinates.heading,
            dto.coordinates.speed,
            dto.source || shared_1.LocationSource.GPS,
            confidence,
        ]);
        await this.db.query(`UPDATE emergency_requests SET
        latitude = $1, longitude = $2, accuracy = $3,
        location_confidence = $4, updated_at = NOW()
       WHERE id = $5`, [
            dto.coordinates.latitude,
            dto.coordinates.longitude,
            dto.coordinates.accuracy,
            confidence,
            incidentId,
        ]);
        return { success: true, timestamp: new Date() };
    }
    async cancelIncident(user, incidentId) {
        const incident = await this.db.queryOne(`SELECT id, caller_id, status FROM emergency_requests WHERE id = $1`, [incidentId]);
        if (!incident) {
            throw new common_1.NotFoundException('Incident not found');
        }
        if (incident.caller_id !== user.id) {
            throw new common_1.ForbiddenException('Not authorized to cancel this incident');
        }
        const cancellableStatuses = [
            shared_1.IncidentStatus.PENDING,
            shared_1.IncidentStatus.ACKNOWLEDGED,
            shared_1.IncidentStatus.DISPATCHED,
        ];
        if (!cancellableStatuses.includes(incident.status)) {
            throw new common_1.BadRequestException('Incident cannot be cancelled at this stage');
        }
        await this.db.transaction(async (client) => {
            await client.query(`UPDATE emergency_requests SET
          status = $1, cancelled_at = NOW(), updated_at = NOW()
         WHERE id = $2`, [shared_1.IncidentStatus.CANCELLED, incidentId]);
            await client.query(`INSERT INTO incident_events (
          incident_id, event_type, actor_id, actor_role, metadata
        ) VALUES ($1, $2, $3, $4, $5)`, [
                incidentId,
                shared_1.IncidentEventType.CANCELLED,
                user.id,
                user.appRole,
                JSON.stringify({ cancelledBy: 'caller' }),
            ]);
            await client.query(`UPDATE unit_assignments SET status = 'cancelled', updated_at = NOW()
         WHERE incident_id = $1 AND status IN ('offered', 'accepted')`, [incidentId]);
        });
        return { success: true, status: shared_1.IncidentStatus.CANCELLED };
    }
    async markSafe(user, incidentId) {
        const incident = await this.db.queryOne(`SELECT id, caller_id, status FROM emergency_requests WHERE id = $1`, [incidentId]);
        if (!incident) {
            throw new common_1.NotFoundException('Incident not found');
        }
        if (incident.caller_id !== user.id) {
            throw new common_1.ForbiddenException('Not authorized');
        }
        await this.db.transaction(async (client) => {
            await client.query(`UPDATE emergency_requests SET
          status = $1, resolved_at = NOW(), updated_at = NOW()
         WHERE id = $2`, [shared_1.IncidentStatus.RESOLVED, incidentId]);
            await client.query(`INSERT INTO incident_events (
          incident_id, event_type, actor_id, actor_role, metadata
        ) VALUES ($1, $2, $3, $4, $5)`, [
                incidentId,
                shared_1.IncidentEventType.MARKED_SAFE,
                user.id,
                user.appRole,
                JSON.stringify({ markedSafeBy: 'caller' }),
            ]);
        });
        return { success: true, status: shared_1.IncidentStatus.RESOLVED };
    }
    async getIncidentById(incidentId) {
        const incident = await this.db.queryOne(`SELECT * FROM emergency_requests WHERE id = $1`, [incidentId]);
        if (!incident) {
            throw new common_1.NotFoundException('Incident not found');
        }
        return this.formatIncident(incident);
    }
    async getIncidentForUser(user, incidentId) {
        const incident = await this.db.queryOne(`SELECT * FROM emergency_requests WHERE id = $1`, [incidentId]);
        if (!incident) {
            throw new common_1.NotFoundException('Incident not found');
        }
        if (user.appRole === 'citizen' && incident.caller_id !== user.id) {
            throw new common_1.ForbiddenException('Not authorized to view this incident');
        }
        return this.formatIncident(incident);
    }
    async getUserIncidents(userId) {
        const incidents = await this.db.queryMany(`SELECT * FROM emergency_requests
       WHERE caller_id = $1
       ORDER BY created_at DESC
       LIMIT 50`, [userId]);
        return incidents.map(this.formatIncident);
    }
    async getActiveIncidentByUser(userId) {
        return this.db.queryOne(`SELECT * FROM emergency_requests
       WHERE caller_id = $1
       AND status NOT IN ('resolved', 'cancelled', 'closed')
       ORDER BY created_at DESC
       LIMIT 1`, [userId]);
    }
    calculateConfidence(location) {
        const accuracy = location.coordinates.accuracy;
        if (location.source === shared_1.LocationSource.LANDMARK || location.source === shared_1.LocationSource.MANUAL) {
            return shared_1.LocationConfidence.LOW;
        }
        if (!accuracy) {
            return shared_1.LocationConfidence.UNKNOWN;
        }
        if (accuracy <= 10) {
            return shared_1.LocationConfidence.HIGH;
        }
        else if (accuracy <= 50) {
            return shared_1.LocationConfidence.MEDIUM;
        }
        else {
            return shared_1.LocationConfidence.LOW;
        }
    }
    formatIncident(incident) {
        return {
            id: incident.id,
            callerPhone: incident.caller_phone,
            callerName: incident.caller_name,
            callerId: incident.caller_id,
            emergencyType: incident.emergency_type,
            status: incident.status,
            priority: incident.priority,
            intakeSource: incident.intake_source,
            locationSource: incident.location_source,
            locationConfidence: incident.location_confidence,
            latitude: incident.latitude ? parseFloat(incident.latitude) : null,
            longitude: incident.longitude ? parseFloat(incident.longitude) : null,
            accuracy: incident.accuracy ? parseFloat(incident.accuracy) : null,
            landmark: incident.landmark,
            trackingToken: incident.tracking_token,
            trackingExpiresAt: incident.tracking_expires_at,
            callerKycStatus: incident.caller_kyc_status,
            callerVerified: incident.caller_verified,
            agencyId: incident.agency_id,
            notes: incident.dispatcher_notes,
            createdAt: incident.created_at,
            updatedAt: incident.updated_at,
            acknowledgedAt: incident.acknowledged_at,
            resolvedAt: incident.resolved_at,
        };
    }
};
exports.IncidentsService = IncidentsService;
exports.IncidentsService = IncidentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], IncidentsService);
//# sourceMappingURL=incidents.service.js.map