import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { LocationSource, LocationConfidence } from '@safepulse/shared';

interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
}

@Injectable()
export class LocationsService {
  constructor(private readonly db: DatabaseService) {}

  async createLocationSnapshot(
    incidentId: string,
    coordinates: Coordinates,
    source: LocationSource,
    confidence: LocationConfidence,
    capturedAt?: Date,
  ) {
    return this.db.mutateOne(
      `INSERT INTO location_snapshots (
        incident_id, latitude, longitude, accuracy,
        altitude, heading, speed, source, confidence, captured_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
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
      ],
    );
  }

  async getLatestLocation(incidentId: string) {
    return this.db.queryOne(
      `SELECT * FROM location_snapshots
       WHERE incident_id = $1
       ORDER BY captured_at DESC
       LIMIT 1`,
      [incidentId],
    );
  }

  async getLocationHistory(incidentId: string, limit: number = 100) {
    return this.db.queryMany(
      `SELECT * FROM location_snapshots
       WHERE incident_id = $1
       ORDER BY captured_at DESC
       LIMIT $2`,
      [incidentId, limit],
    );
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    // Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  calculateConfidence(accuracy?: number, source?: LocationSource): LocationConfidence {
    if (source === LocationSource.LANDMARK || source === LocationSource.MANUAL) {
      return LocationConfidence.LOW;
    }

    if (!accuracy) {
      return LocationConfidence.UNKNOWN;
    }

    if (accuracy <= 10) {
      return LocationConfidence.HIGH;
    } else if (accuracy <= 50) {
      return LocationConfidence.MEDIUM;
    } else {
      return LocationConfidence.LOW;
    }
  }
}
