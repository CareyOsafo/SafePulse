import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { DatabaseService } from '../../database/database.service';
import { IncidentsService } from '../incidents/incidents.service';
import { UsersService } from '../users/users.service';
import {
  UssdSessionState,
  EmergencyType,
  UssdMenus,
  LocationSource,
  LocationConfidence,
  IncidentPriority,
} from '@safepulse/shared';
import { UssdRequestDto, UssdResponseDto } from './dto/ussd.dto';

@Injectable()
export class UssdService {
  constructor(
    private readonly db: DatabaseService,
    @Inject(forwardRef(() => IncidentsService))
    private readonly incidentsService: IncidentsService,
    private readonly usersService: UsersService,
  ) {}

  async handleSession(dto: UssdRequestDto): Promise<UssdResponseDto> {
    // Parse USSD text input
    // Format: empty string = new session, "1*2*text" = chained responses
    const inputs = dto.text ? dto.text.split('*') : [];
    const currentInput = inputs.length > 0 ? inputs[inputs.length - 1] : '';
    

    // Get or create session
    let session = await this.getSession(dto.sessionId);

    if (!session) {
      session = await this.createSession(dto);
    }

    // Process based on current state
    const response = await this.processState(session, currentInput, inputs);
    const emergencyType = session.emergency_type as EmergencyType;

    return response;
  }

  private async getSession(sessionId: string) {
    return this.db.queryOne(
      `SELECT * FROM ussd_sessions
       WHERE session_id = $1
       AND state NOT IN ('completed', 'cancelled')
       AND expires_at > NOW()`,
      [sessionId],
    );
  }

  private async createSession(dto: UssdRequestDto) {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Try to find existing user
    const user = await this.db.queryOne(
      `SELECT id FROM users WHERE phone_number = $1`,
      [dto.phoneNumber],
    );

    return this.db.mutateOne(
      `INSERT INTO ussd_sessions (
        session_id, phone_number, service_code, state, user_id, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [dto.sessionId, dto.phoneNumber, dto.serviceCode, UssdSessionState.INIT, user?.id, expiresAt],
    );
  }

  private async updateSession(
    sessionId: string,
    state: UssdSessionState,
    updates: Record<string, any> = {},
  ) {
    const fields = ['state = $1', 'updated_at = NOW()'];
    const values: any[] = [state];
    let paramIndex = 2;

    if (updates.emergencyType !== undefined) {
      fields.push(`emergency_type = $${paramIndex++}`);
      values.push(updates.emergencyType);
    }
    if (updates.locationType !== undefined) {
      fields.push(`location_type = $${paramIndex++}`);
      values.push(updates.locationType);
    }
    if (updates.landmark !== undefined) {
      fields.push(`landmark = $${paramIndex++}`);
      values.push(updates.landmark);
    }
    if (updates.latitude !== undefined) {
      fields.push(`latitude = $${paramIndex++}`);
      values.push(updates.latitude);
    }
    if (updates.longitude !== undefined) {
      fields.push(`longitude = $${paramIndex++}`);
      values.push(updates.longitude);
    }
    if (updates.incidentId !== undefined) {
      fields.push(`incident_id = $${paramIndex++}`);
      values.push(updates.incidentId);
    }
    if (updates.lastInput !== undefined) {
      fields.push(`last_input = $${paramIndex++}`);
      values.push(updates.lastInput);
    }

    values.push(sessionId);

    return this.db.mutateOne(
      `UPDATE ussd_sessions SET ${fields.join(', ')}
       WHERE session_id = $${paramIndex}
       RETURNING *`,
      values,
    );
  }

  private async processState(
    session: any,
    currentInput: string,
    allInputs: string[],
  ): Promise<UssdResponseDto> {
    // Update input history
    await this.db.query(
      `UPDATE ussd_sessions SET
        input_history = array_append(COALESCE(input_history, '{}'), $1),
        last_input = $1
       WHERE id = $2`,
      [currentInput, session.id],
    );

    switch (session.state) {
      case UssdSessionState.INIT:
        return this.handleInit(session);

      case UssdSessionState.SELECT_TYPE:
        return this.handleSelectType(session, currentInput);

      case UssdSessionState.CONFIRM:
        return this.handleConfirm(session, currentInput);

      case UssdSessionState.SELECT_LOCATION:
        return this.handleSelectLocation(session, currentInput);

      case UssdSessionState.ENTER_LANDMARK:
        return this.handleEnterLandmark(session, currentInput);

      default:
        return { response: UssdMenus.error, endSession: true };
    }
  }

  private async handleInit(session: any): Promise<UssdResponseDto> {
    await this.updateSession(session.session_id, UssdSessionState.SELECT_TYPE);
    return { response: UssdMenus.welcome, endSession: false };
  }

  private async handleSelectType(session: any, input: string): Promise<UssdResponseDto> {
    const typeMap: Record<string, EmergencyType> = {
      '1': EmergencyType.MEDICAL,
      '2': EmergencyType.FIRE,
      '3': EmergencyType.SAFETY,
      '4': EmergencyType.SECURITY,
    };

    if (input === '0') {
      await this.updateSession(session.session_id, UssdSessionState.CANCELLED);
      return { response: UssdMenus.cancelled, endSession: true };
    }

    const emergencyType = typeMap[input];
    if (!emergencyType) {
      return { response: UssdMenus.welcome, endSession: false };
    }

    await this.updateSession(session.session_id, UssdSessionState.CONFIRM, {
      emergencyType,
    });

    const typeNames: Record<EmergencyType, string> = {
      [EmergencyType.MEDICAL]: 'Medical Emergency',
      [EmergencyType.FIRE]: 'Fire Emergency',
      [EmergencyType.SAFETY]: 'Safety Emergency',
      [EmergencyType.SECURITY]: 'Security Emergency',
    };

    return { response: UssdMenus.confirm(typeNames[emergencyType]), endSession: false };
  }

  private async handleConfirm(session: any, input: string): Promise<UssdResponseDto> {
    if (input === '0') {
      await this.updateSession(session.session_id, UssdSessionState.CANCELLED);
      return { response: UssdMenus.cancelled, endSession: true };
    }

    if (input !== '1') {
      const typeNames: Record<EmergencyType, string> = {
        [EmergencyType.MEDICAL]: 'Medical Emergency',
        [EmergencyType.FIRE]: 'Fire Emergency',
        [EmergencyType.SAFETY]: 'Safety Emergency',
        [EmergencyType.SECURITY]: 'Security Emergency',
      };
      const emergencyType = session.emergency_type as EmergencyType;
      return { response: UssdMenus.confirm(typeNames[emergencyType]), endSession: false };
    }

    // Check if user has saved places
    if (session.user_id) {
      const savedPlaces = await this.usersService.getSavedPlaces(session.user_id);
      if (savedPlaces.home || savedPlaces.work) {
        await this.updateSession(session.session_id, UssdSessionState.SELECT_LOCATION);
        return { response: UssdMenus.selectLocation, endSession: false };
      }
    }

    // No saved places, go directly to landmark input
    await this.updateSession(session.session_id, UssdSessionState.ENTER_LANDMARK);
    return { response: UssdMenus.enterLandmark, endSession: false };
  }

  private async handleSelectLocation(session: any, input: string): Promise<UssdResponseDto> {
    if (input === '0') {
      await this.updateSession(session.session_id, UssdSessionState.CANCELLED);
      return { response: UssdMenus.cancelled, endSession: true };
    }

    if (input === '3') {
      await this.updateSession(session.session_id, UssdSessionState.ENTER_LANDMARK);
      return { response: UssdMenus.enterLandmark, endSession: false };
    }

    let savedPlaces: any = null;
    if (session.user_id) {
      savedPlaces = await this.usersService.getSavedPlaces(session.user_id);
    }

    let location: { latitude: number; longitude: number; name: string } | null = null;

    if (input === '1' && savedPlaces?.home) {
      location = { ...savedPlaces.home, name: 'Home' };
    } else if (input === '2' && savedPlaces?.work) {
      location = { ...savedPlaces.work, name: 'Work' };
    }

    if (!location) {
      return { response: UssdMenus.selectLocation, endSession: false };
    }

    // Create incident with saved place
    return this.createIncidentAndRespond(session, {
      latitude: location.latitude,
      longitude: location.longitude,
      source: LocationSource.SAVED_PLACE,
      landmark: location.name,
    });
  }

  private async handleEnterLandmark(session: any, input: string): Promise<UssdResponseDto> {
    if (!input || input.length < 3) {
      return { response: UssdMenus.enterLandmark, endSession: false };
    }

    // Create incident with landmark
    return this.createIncidentAndRespond(session, {
      source: LocationSource.LANDMARK,
      landmark: input,
    });
  }

  private async createIncidentAndRespond(
    session: any,
    locationData: {
      latitude?: number;
      longitude?: number;
      source: LocationSource;
      landmark?: string;
    },
  ): Promise<UssdResponseDto> {
    try {
      // Create a minimal user context for USSD
      const userContext = {
        id: session.user_id || 'ussd-user',
        phoneNumber: session.phone_number,
        fullName: null,
        supabaseUid: '',
        appRole: 'citizen' as const,
      };

      // Generate tracking token
      const trackingToken = randomBytes(16).toString('hex');

      // Insert incident directly for USSD (bypassing normal service due to minimal context)
      const incident = await this.db.mutateOne(
        `INSERT INTO emergency_requests (
          caller_id, caller_phone, emergency_type, status, priority,
          intake_source, location_source, location_confidence,
          latitude, longitude, landmark,
          tracking_token, tracking_expires_at,
          caller_kyc_status, caller_verified
        ) VALUES (
          $1, $2, $3, 'pending', 'normal',
          'ussd', $4, $5,
          $6, $7, $8,
          $9, NOW() + INTERVAL '24 hours',
          'not_started', false
        ) RETURNING id`,
        [
          session.user_id,
          session.phone_number,
          session.emergency_type,
          locationData.source,
          locationData.latitude ? LocationConfidence.HIGH : LocationConfidence.LOW,
          locationData.latitude || null,
          locationData.longitude || null,
          locationData.landmark,
          trackingToken,
        ],
      );

      // Update session
      await this.updateSession(session.session_id, UssdSessionState.COMPLETED, {
        incidentId: incident.id,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        landmark: locationData.landmark,
        locationType: locationData.source,
      });

      // Create audit event
      await this.db.query(
        `INSERT INTO incident_events (incident_id, event_type, metadata)
         VALUES ($1, 'created', $2)`,
        [incident.id, JSON.stringify({ intakeSource: 'ussd', sessionId: session.session_id })],
      );

      return {
        response: UssdMenus.success(trackingToken.substring(0, 8).toUpperCase()),
        endSession: true,
      };
    } catch (error) {
      console.error('USSD incident creation failed:', error);
      await this.updateSession(session.session_id, UssdSessionState.CANCELLED);
      return { response: UssdMenus.error, endSession: true };
    }
  }
}
