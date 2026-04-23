import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { createHmac, randomBytes } from 'crypto';
import { DatabaseService } from '../../database/database.service';
import { AuthenticatedUser } from '../../auth/auth.service';
import { CreateIncidentDto, UpdateLocationDto } from './dto/incident.dto';
import {
  IncidentStatus,
  KycStatus,
  IncidentEventType,
  DispatchConfig,
  LocationConfidence,
  LocationSource,
} from '@safepulse/shared';

@Injectable()
export class IncidentsService {
  constructor(private readonly db: DatabaseService) {}

  async createIncident(
    user: AuthenticatedUser,
    dto: CreateIncidentDto,
    idempotencyKey?: string,
  ) {
    // Check KYC status - block only if failed
    const userKyc = await this.db.queryOne<{ kyc_status: string }>(
      'SELECT kyc_status FROM users WHERE id = $1',
      [user.id],
    );

    if (userKyc?.kyc_status === KycStatus.FAILED) {
      throw new ForbiddenException({
        code: 'KYC_FAILED',
        message: 'Your identity verification failed. Please retry verification.',
      });
    }

    // Check idempotency
    if (idempotencyKey) {
      const existing = await this.db.queryOne(
        'SELECT id, status FROM emergency_requests WHERE idempotency_key = $1',
        [idempotencyKey],
      );

      if (existing) {
        return this.getIncidentById(existing.id);
      }
    }

    // Generate tracking token
    const trackingToken = randomBytes(32).toString('hex');
    const trackingExpiresAt = new Date(
      Date.now() + DispatchConfig.trackingTokenExpiryHours * 60 * 60 * 1000,
    );

    // Determine location confidence
    const confidence = this.calculateConfidence(dto.location);

    // Create incident
    const incident = await this.db.transaction(async (client) => {
      // Insert incident
      const result = await client.query(
        `INSERT INTO emergency_requests (
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
        ) RETURNING *`,
        [
          user.id,
          user.phoneNumber,
          user.fullName,
          dto.emergencyType,
          IncidentStatus.PENDING,
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
          userKyc?.kyc_status || KycStatus.NOT_STARTED,
          userKyc?.kyc_status === KycStatus.VERIFIED,
          idempotencyKey,
        ],
      );

      const newIncident = result.rows[0];

      // Create initial location snapshot
      await client.query(
        `INSERT INTO location_snapshots (
          incident_id, latitude, longitude, accuracy,
          source, confidence, captured_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          newIncident.id,
          dto.location.coordinates.latitude,
          dto.location.coordinates.longitude,
          dto.location.coordinates.accuracy,
          dto.location.source,
          confidence,
          dto.location.timestamp || new Date(),
        ],
      );

      // Create audit event
      await client.query(
        `INSERT INTO incident_events (
          incident_id, event_type, actor_id, actor_role, metadata
        ) VALUES ($1, $2, $3, $4, $5)`,
        [
          newIncident.id,
          IncidentEventType.CREATED,
          user.id,
          user.appRole,
          JSON.stringify({
            emergencyType: dto.emergencyType,
            intakeSource: 'app',
            locationSource: dto.location.source,
          }),
        ],
      );

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

  async updateLocation(
    user: AuthenticatedUser,
    incidentId: string,
    dto: UpdateLocationDto,
  ) {
    // Verify ownership and active status
    const incident = await this.db.queryOne(
      `SELECT id, caller_id, status FROM emergency_requests
       WHERE id = $1 AND status NOT IN ('resolved', 'cancelled', 'closed')`,
      [incidentId],
    );

    if (!incident) {
      throw new NotFoundException('Incident not found or already closed');
    }

    if (incident.caller_id !== user.id) {
      throw new ForbiddenException('Not authorized to update this incident');
    }

    const confidence = this.calculateConfidence({
      coordinates: dto.coordinates,
      source: dto.source || LocationSource.GPS,
    });

    // Insert location snapshot
    await this.db.query(
      `INSERT INTO location_snapshots (
        incident_id, latitude, longitude, accuracy,
        altitude, heading, speed, source, confidence, captured_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
      [
        incidentId,
        dto.coordinates.latitude,
        dto.coordinates.longitude,
        dto.coordinates.accuracy,
        dto.coordinates.altitude,
        dto.coordinates.heading,
        dto.coordinates.speed,
        dto.source || LocationSource.GPS,
        confidence,
      ],
    );

    // Update incident's latest location
    await this.db.query(
      `UPDATE emergency_requests SET
        latitude = $1, longitude = $2, accuracy = $3,
        location_confidence = $4, updated_at = NOW()
       WHERE id = $5`,
      [
        dto.coordinates.latitude,
        dto.coordinates.longitude,
        dto.coordinates.accuracy,
        confidence,
        incidentId,
      ],
    );

    return { success: true, timestamp: new Date() };
  }

  async cancelIncident(user: AuthenticatedUser, incidentId: string) {
    const incident = await this.db.queryOne(
      `SELECT id, caller_id, status FROM emergency_requests WHERE id = $1`,
      [incidentId],
    );

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    if (incident.caller_id !== user.id) {
      throw new ForbiddenException('Not authorized to cancel this incident');
    }

    const cancellableStatuses = [
      IncidentStatus.PENDING,
      IncidentStatus.ACKNOWLEDGED,
      IncidentStatus.DISPATCHED,
    ];

    if (!cancellableStatuses.includes(incident.status)) {
      throw new BadRequestException('Incident cannot be cancelled at this stage');
    }

    await this.db.transaction(async (client) => {
      await client.query(
        `UPDATE emergency_requests SET
          status = $1, cancelled_at = NOW(), updated_at = NOW()
         WHERE id = $2`,
        [IncidentStatus.CANCELLED, incidentId],
      );

      await client.query(
        `INSERT INTO incident_events (
          incident_id, event_type, actor_id, actor_role, metadata
        ) VALUES ($1, $2, $3, $4, $5)`,
        [
          incidentId,
          IncidentEventType.CANCELLED,
          user.id,
          user.appRole,
          JSON.stringify({ cancelledBy: 'caller' }),
        ],
      );

      // Cancel any pending assignments
      await client.query(
        `UPDATE unit_assignments SET status = 'cancelled', updated_at = NOW()
         WHERE incident_id = $1 AND status IN ('offered', 'accepted')`,
        [incidentId],
      );
    });

    return { success: true, status: IncidentStatus.CANCELLED };
  }

  async markSafe(user: AuthenticatedUser, incidentId: string) {
    const incident = await this.db.queryOne(
      `SELECT id, caller_id, status FROM emergency_requests WHERE id = $1`,
      [incidentId],
    );

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    if (incident.caller_id !== user.id) {
      throw new ForbiddenException('Not authorized');
    }

    await this.db.transaction(async (client) => {
      await client.query(
        `UPDATE emergency_requests SET
          status = $1, resolved_at = NOW(), updated_at = NOW()
         WHERE id = $2`,
        [IncidentStatus.RESOLVED, incidentId],
      );

      await client.query(
        `INSERT INTO incident_events (
          incident_id, event_type, actor_id, actor_role, metadata
        ) VALUES ($1, $2, $3, $4, $5)`,
        [
          incidentId,
          IncidentEventType.MARKED_SAFE,
          user.id,
          user.appRole,
          JSON.stringify({ markedSafeBy: 'caller' }),
        ],
      );
    });

    return { success: true, status: IncidentStatus.RESOLVED };
  }

  async getIncidentById(incidentId: string) {
    const incident = await this.db.queryOne(
      `SELECT * FROM emergency_requests WHERE id = $1`,
      [incidentId],
    );

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    return this.formatIncident(incident);
  }

  async getIncidentForUser(user: AuthenticatedUser, incidentId: string) {
    const incident = await this.db.queryOne(
      `SELECT * FROM emergency_requests WHERE id = $1`,
      [incidentId],
    );

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    // Check authorization based on role
    if (user.appRole === 'citizen' && incident.caller_id !== user.id) {
      throw new ForbiddenException('Not authorized to view this incident');
    }

    return this.formatIncident(incident);
  }

  async getUserIncidents(userId: string) {
    const incidents = await this.db.queryMany(
      `SELECT * FROM emergency_requests
       WHERE caller_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [userId],
    );

    return incidents.map(this.formatIncident);
  }

  async getActiveIncidentByUser(userId: string) {
    return this.db.queryOne(
      `SELECT * FROM emergency_requests
       WHERE caller_id = $1
       AND status NOT IN ('resolved', 'cancelled', 'closed')
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId],
    );
  }

  private calculateConfidence(location: {
    coordinates: { accuracy?: number };
    source: LocationSource;
  }): LocationConfidence {
    const accuracy = location.coordinates.accuracy;

    if (location.source === LocationSource.LANDMARK || location.source === LocationSource.MANUAL) {
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

  private formatIncident(incident: any) {
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
}
