import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class TrackingService {
  constructor(private readonly db: DatabaseService) {}

  async getTrackingInfo(token: string) {
    const incident = await this.db.queryOne(
      `SELECT
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
         AND er.tracking_expires_at > NOW()`,
      [token],
    );

    if (!incident) {
      return null;
    }

    // Get latest location
    const location = await this.db.queryOne(
      `SELECT latitude, longitude, accuracy, captured_at
       FROM location_snapshots
       WHERE incident_id = $1
       ORDER BY captured_at DESC
       LIMIT 1`,
      [incident.id],
    );

    // Get recent timeline events (limited info for public view)
    const events = await this.db.queryMany(
      `SELECT event_type, created_at
       FROM incident_events
       WHERE incident_id = $1
         AND event_type IN ('created', 'acknowledged', 'unit_en_route', 'unit_on_scene', 'resolved')
       ORDER BY created_at DESC
       LIMIT 10`,
      [incident.id],
    );

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

  async isTokenValid(token: string): Promise<boolean> {
    const result = await this.db.queryOne<{ exists: boolean }>(
      `SELECT EXISTS(
        SELECT 1 FROM emergency_requests
        WHERE tracking_token = $1
          AND tracking_expires_at > NOW()
      ) as exists`,
      [token],
    );

    return result?.exists || false;
  }
}
