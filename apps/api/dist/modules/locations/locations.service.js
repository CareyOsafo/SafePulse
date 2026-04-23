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
exports.LocationsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/database.service");
const shared_1 = require("@safepulse/shared");
let LocationsService = class LocationsService {
    constructor(db) {
        this.db = db;
    }
    async createLocationSnapshot(incidentId, coordinates, source, confidence, capturedAt) {
        return this.db.mutateOne(`INSERT INTO location_snapshots (
        incident_id, latitude, longitude, accuracy,
        altitude, heading, speed, source, confidence, captured_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`, [
            incidentId,
            coordinates.latitude,
            coordinates.longitude,
            coordinates.accuracy,
            coordinates.altitude,
            coordinates.heading,
            coordinates.speed,
            source,
            confidence,
            capturedAt || new Date(),
        ]);
    }
    async getLatestLocation(incidentId) {
        return this.db.queryOne(`SELECT * FROM location_snapshots
       WHERE incident_id = $1
       ORDER BY captured_at DESC
       LIMIT 1`, [incidentId]);
    }
    async getLocationHistory(incidentId, limit = 100) {
        return this.db.queryMany(`SELECT * FROM location_snapshots
       WHERE incident_id = $1
       ORDER BY captured_at DESC
       LIMIT $2`, [incidentId, limit]);
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) *
                Math.cos(this.toRad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRad(deg) {
        return deg * (Math.PI / 180);
    }
    calculateConfidence(accuracy, source) {
        if (source === shared_1.LocationSource.LANDMARK || source === shared_1.LocationSource.MANUAL) {
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
};
exports.LocationsService = LocationsService;
exports.LocationsService = LocationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], LocationsService);
//# sourceMappingURL=locations.service.js.map