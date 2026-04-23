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
exports.TrackingService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/database.service");
let TrackingService = class TrackingService {
    constructor(db) {
        this.db = db;
    }
    async getTrackingInfo(token) {
        const incident = await this.db.queryOne(`SELECT
        er.id,
        er.emergency_type,
        er.status,
        er.priority,
        er.created_at,
        er.acknowledged_at,
        er.dispatched_at,
        er.resolved_at,
        u.call_sign as unit_call_sign,
        u.unit_type
       FROM emergency_requests er
       LEFT JOIN units u ON er.primary_unit_id = u.id
       WHERE er.tracking_token = $1
         AND er.tracking_expires_at > NOW()`, [token]);
        if (!incident) {
            return null;
        }
        const location = await this.db.queryOne(`SELECT latitude, longitude, accuracy, captured_at
       FROM location_snapshots
       WHERE incident_id = $1
       ORDER BY captured_at DESC
       LIMIT 1`, [incident.id]);
        const events = await this.db.queryMany(`SELECT event_type, created_at
       FROM incident_events
       WHERE incident_id = $1
         AND event_type IN ('created', 'acknowledged', 'unit_en_route', 'unit_on_scene', 'resolved')
       ORDER BY created_at DESC
       LIMIT 10`, [incident.id]);
        return {
            incidentId: incident.id,
            emergencyType: incident.emergency_type,
            status: incident.status,
            priority: incident.priority,
            createdAt: incident.created_at,
            acknowledgedAt: incident.acknowledged_at,
            dispatchedAt: incident.dispatched_at,
            resolvedAt: incident.resolved_at,
            respondingUnit: incident.unit_call_sign
                ? {
                    callSign: incident.unit_call_sign,
                    type: incident.unit_type,
                }
                : null,
            location: location
                ? {
                    latitude: parseFloat(location.latitude),
                    longitude: parseFloat(location.longitude),
                    accuracy: location.accuracy ? parseFloat(location.accuracy) : null,
                    updatedAt: location.captured_at,
                }
                : null,
            timeline: events.map((e) => ({
                event: e.event_type,
                timestamp: e.created_at,
            })),
        };
    }
    async isTokenValid(token) {
        const result = await this.db.queryOne(`SELECT EXISTS(
        SELECT 1 FROM emergency_requests
        WHERE tracking_token = $1
          AND tracking_expires_at > NOW()
      ) as exists`, [token]);
        return result?.exists || false;
    }
};
exports.TrackingService = TrackingService;
exports.TrackingService = TrackingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], TrackingService);
//# sourceMappingURL=tracking.service.js.map