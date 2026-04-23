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
exports.UssdService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const database_service_1 = require("../../database/database.service");
const incidents_service_1 = require("../incidents/incidents.service");
const users_service_1 = require("../users/users.service");
const shared_1 = require("@safepulse/shared");
let UssdService = class UssdService {
    constructor(db, incidentsService, usersService) {
        this.db = db;
        this.incidentsService = incidentsService;
        this.usersService = usersService;
    }
    async handleSession(dto) {
        const inputs = dto.text ? dto.text.split('*') : [];
        const currentInput = inputs.length > 0 ? inputs[inputs.length - 1] : '';
        let session = await this.getSession(dto.sessionId);
        if (!session) {
            session = await this.createSession(dto);
        }
        const response = await this.processState(session, currentInput, inputs);
        const emergencyType = session.emergency_type;
        return response;
    }
    async getSession(sessionId) {
        return this.db.queryOne(`SELECT * FROM ussd_sessions
       WHERE session_id = $1
       AND state NOT IN ('completed', 'cancelled')
       AND expires_at > NOW()`, [sessionId]);
    }
    async createSession(dto) {
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        const user = await this.db.queryOne(`SELECT id FROM users WHERE phone_number = $1`, [dto.phoneNumber]);
        return this.db.mutateOne(`INSERT INTO ussd_sessions (
        session_id, phone_number, service_code, state, user_id, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`, [dto.sessionId, dto.phoneNumber, dto.serviceCode, shared_1.UssdSessionState.INIT, user?.id, expiresAt]);
    }
    async updateSession(sessionId, state, updates = {}) {
        const fields = ['state = $1', 'updated_at = NOW()'];
        const values = [state];
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
        return this.db.mutateOne(`UPDATE ussd_sessions SET ${fields.join(', ')}
       WHERE session_id = $${paramIndex}
       RETURNING *`, values);
    }
    async processState(session, currentInput, allInputs) {
        await this.db.query(`UPDATE ussd_sessions SET
        input_history = array_append(COALESCE(input_history, '{}'), $1),
        last_input = $1
       WHERE id = $2`, [currentInput, session.id]);
        switch (session.state) {
            case shared_1.UssdSessionState.INIT:
                return this.handleInit(session);
            case shared_1.UssdSessionState.SELECT_TYPE:
                return this.handleSelectType(session, currentInput);
            case shared_1.UssdSessionState.CONFIRM:
                return this.handleConfirm(session, currentInput);
            case shared_1.UssdSessionState.SELECT_LOCATION:
                return this.handleSelectLocation(session, currentInput);
            case shared_1.UssdSessionState.ENTER_LANDMARK:
                return this.handleEnterLandmark(session, currentInput);
            default:
                return { response: shared_1.UssdMenus.error, endSession: true };
        }
    }
    async handleInit(session) {
        await this.updateSession(session.session_id, shared_1.UssdSessionState.SELECT_TYPE);
        return { response: shared_1.UssdMenus.welcome, endSession: false };
    }
    async handleSelectType(session, input) {
        const typeMap = {
            '1': shared_1.EmergencyType.MEDICAL,
            '2': shared_1.EmergencyType.FIRE,
            '3': shared_1.EmergencyType.SAFETY,
            '4': shared_1.EmergencyType.SECURITY,
        };
        if (input === '0') {
            await this.updateSession(session.session_id, shared_1.UssdSessionState.CANCELLED);
            return { response: shared_1.UssdMenus.cancelled, endSession: true };
        }
        const emergencyType = typeMap[input];
        if (!emergencyType) {
            return { response: shared_1.UssdMenus.welcome, endSession: false };
        }
        await this.updateSession(session.session_id, shared_1.UssdSessionState.CONFIRM, {
            emergencyType,
        });
        const typeNames = {
            [shared_1.EmergencyType.MEDICAL]: 'Medical Emergency',
            [shared_1.EmergencyType.FIRE]: 'Fire Emergency',
            [shared_1.EmergencyType.SAFETY]: 'Safety Emergency',
            [shared_1.EmergencyType.SECURITY]: 'Security Emergency',
        };
        return { response: shared_1.UssdMenus.confirm(typeNames[emergencyType]), endSession: false };
    }
    async handleConfirm(session, input) {
        if (input === '0') {
            await this.updateSession(session.session_id, shared_1.UssdSessionState.CANCELLED);
            return { response: shared_1.UssdMenus.cancelled, endSession: true };
        }
        if (input !== '1') {
            const typeNames = {
                [shared_1.EmergencyType.MEDICAL]: 'Medical Emergency',
                [shared_1.EmergencyType.FIRE]: 'Fire Emergency',
                [shared_1.EmergencyType.SAFETY]: 'Safety Emergency',
                [shared_1.EmergencyType.SECURITY]: 'Security Emergency',
            };
            const emergencyType = session.emergency_type;
            return { response: shared_1.UssdMenus.confirm(typeNames[emergencyType]), endSession: false };
        }
        if (session.user_id) {
            const savedPlaces = await this.usersService.getSavedPlaces(session.user_id);
            if (savedPlaces.home || savedPlaces.work) {
                await this.updateSession(session.session_id, shared_1.UssdSessionState.SELECT_LOCATION);
                return { response: shared_1.UssdMenus.selectLocation, endSession: false };
            }
        }
        await this.updateSession(session.session_id, shared_1.UssdSessionState.ENTER_LANDMARK);
        return { response: shared_1.UssdMenus.enterLandmark, endSession: false };
    }
    async handleSelectLocation(session, input) {
        if (input === '0') {
            await this.updateSession(session.session_id, shared_1.UssdSessionState.CANCELLED);
            return { response: shared_1.UssdMenus.cancelled, endSession: true };
        }
        if (input === '3') {
            await this.updateSession(session.session_id, shared_1.UssdSessionState.ENTER_LANDMARK);
            return { response: shared_1.UssdMenus.enterLandmark, endSession: false };
        }
        let savedPlaces = null;
        if (session.user_id) {
            savedPlaces = await this.usersService.getSavedPlaces(session.user_id);
        }
        let location = null;
        if (input === '1' && savedPlaces?.home) {
            location = { ...savedPlaces.home, name: 'Home' };
        }
        else if (input === '2' && savedPlaces?.work) {
            location = { ...savedPlaces.work, name: 'Work' };
        }
        if (!location) {
            return { response: shared_1.UssdMenus.selectLocation, endSession: false };
        }
        return this.createIncidentAndRespond(session, {
            latitude: location.latitude,
            longitude: location.longitude,
            source: shared_1.LocationSource.SAVED_PLACE,
            landmark: location.name,
        });
    }
    async handleEnterLandmark(session, input) {
        if (!input || input.length < 3) {
            return { response: shared_1.UssdMenus.enterLandmark, endSession: false };
        }
        return this.createIncidentAndRespond(session, {
            source: shared_1.LocationSource.LANDMARK,
            landmark: input,
        });
    }
    async createIncidentAndRespond(session, locationData) {
        try {
            const userContext = {
                id: session.user_id || 'ussd-user',
                phoneNumber: session.phone_number,
                fullName: null,
                supabaseUid: '',
                appRole: 'citizen',
            };
            const trackingToken = (0, crypto_1.randomBytes)(16).toString('hex');
            const incident = await this.db.mutateOne(`INSERT INTO emergency_requests (
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
        ) RETURNING id`, [
                session.user_id,
                session.phone_number,
                session.emergency_type,
                locationData.source,
                locationData.latitude ? shared_1.LocationConfidence.HIGH : shared_1.LocationConfidence.LOW,
                locationData.latitude || null,
                locationData.longitude || null,
                locationData.landmark,
                trackingToken,
            ]);
            await this.updateSession(session.session_id, shared_1.UssdSessionState.COMPLETED, {
                incidentId: incident.id,
                latitude: locationData.latitude,
                longitude: locationData.longitude,
                landmark: locationData.landmark,
                locationType: locationData.source,
            });
            await this.db.query(`INSERT INTO incident_events (incident_id, event_type, metadata)
         VALUES ($1, 'created', $2)`, [incident.id, JSON.stringify({ intakeSource: 'ussd', sessionId: session.session_id })]);
            return {
                response: shared_1.UssdMenus.success(trackingToken.substring(0, 8).toUpperCase()),
                endSession: true,
            };
        }
        catch (error) {
            console.error('USSD incident creation failed:', error);
            await this.updateSession(session.session_id, shared_1.UssdSessionState.CANCELLED);
            return { response: shared_1.UssdMenus.error, endSession: true };
        }
    }
};
exports.UssdService = UssdService;
exports.UssdService = UssdService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => incidents_service_1.IncidentsService))),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        incidents_service_1.IncidentsService,
        users_service_1.UsersService])
], UssdService);
//# sourceMappingURL=ussd.service.js.map