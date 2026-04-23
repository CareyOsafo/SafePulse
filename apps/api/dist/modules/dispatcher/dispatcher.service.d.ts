import { DatabaseService } from '../../database/database.service';
import { DispatchService } from '../dispatch/dispatch.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { AuthenticatedUser } from '../../auth/auth.service';
import { IncidentStatus } from '@safepulse/shared';
import { AcknowledgeIncidentDto, UpdateIncidentStatusDto, AssignUnitDto, SendMessageDto, IncidentFiltersDto } from './dto/dispatcher.dto';
export declare class DispatcherService {
    private readonly db;
    private readonly dispatchService;
    private readonly realtimeGateway;
    private readonly notificationsService;
    constructor(db: DatabaseService, dispatchService: DispatchService, realtimeGateway: RealtimeGateway, notificationsService: NotificationsService);
    getIncidents(agencyId: string, filters: IncidentFiltersDto): Promise<{
        data: {
            id: any;
            emergencyType: any;
            status: any;
            priority: any;
            callerPhone: any;
            callerName: any;
            callerVerified: any;
            locationConfidence: any;
            latitude: number | null;
            longitude: number | null;
            landmark: any;
            intakeSource: any;
            unitCallSign: any;
            unitStatus: any;
            escalationLevel: any;
            createdAt: any;
            acknowledgedAt: any;
            eventCount: number;
            lastEventAt: any;
        }[];
        meta: {
            total: number;
            limit: number;
            offset: number;
        };
    }>;
    getIncidentDetails(agencyId: string, incidentId: string): Promise<{
        assignments: {
            id: any;
            unitId: any;
            callSign: any;
            unitType: any;
            phoneNumber: any;
            status: any;
            offeredAt: any;
            respondedAt: any;
            declineReason: any;
            isPrimary: any;
            unitLocation: {
                latitude: number;
                longitude: number;
            } | null;
        }[];
        latestLocation: {
            latitude: number;
            longitude: number;
            accuracy: number | null;
            confidence: any;
            capturedAt: any;
        } | null;
        emergencyContacts: {
            id: any;
            name: any;
            phoneNumber: any;
            relationship: any;
            isPrimary: any;
        }[];
        callerId: any;
        callerKyc: any;
        callerFullName: any;
        accuracy: number | null;
        description: any;
        notes: any;
        trackingToken: any;
        trackingExpiresAt: any;
        agencyId: any;
        primaryUnitId: any;
        unitPhone: any;
        dispatchedAt: any;
        resolvedAt: any;
        cancelledAt: any;
        id: any;
        emergencyType: any;
        status: any;
        priority: any;
        callerPhone: any;
        callerName: any;
        callerVerified: any;
        locationConfidence: any;
        latitude: number | null;
        longitude: number | null;
        landmark: any;
        intakeSource: any;
        unitCallSign: any;
        unitStatus: any;
        escalationLevel: any;
        createdAt: any;
        acknowledgedAt: any;
        eventCount: number;
        lastEventAt: any;
    }>;
    acknowledgeIncident(user: AuthenticatedUser, incidentId: string, dto: AcknowledgeIncidentDto): Promise<{
        success: boolean;
        status: IncidentStatus;
    }>;
    updateIncidentStatus(user: AuthenticatedUser, incidentId: string, dto: UpdateIncidentStatusDto): Promise<{
        success: boolean;
        status: IncidentStatus;
    }>;
    addNotes(user: AuthenticatedUser, incidentId: string, notes: string): Promise<{
        success: boolean;
    }>;
    assignUnit(user: AuthenticatedUser, incidentId: string, dto: AssignUnitDto): Promise<{
        success: boolean;
    }>;
    sendMessage(user: AuthenticatedUser, incidentId: string, dto: SendMessageDto): Promise<{
        success: boolean;
    }>;
    getIncidentTimeline(incidentId: string): Promise<{
        id: any;
        eventType: any;
        actorName: any;
        actorRole: any;
        metadata: any;
        description: any;
        createdAt: any;
    }[]>;
    getLocationHistory(incidentId: string): Promise<{
        id: any;
        latitude: number;
        longitude: number;
        accuracy: number | null;
        source: any;
        confidence: any;
        capturedAt: any;
    }[]>;
    getDeliveryLogs(incidentId: string): Promise<{
        id: any;
        channel: any;
        recipientPhone: any;
        recipientName: any;
        messageType: any;
        status: any;
        attemptCount: any;
        sentAt: any;
        deliveredAt: any;
        failedAt: any;
        errorMessage: any;
        createdAt: any;
    }[]>;
    getAgencyUnits(agencyId: string, status?: string): Promise<{
        id: any;
        callSign: any;
        unitType: any;
        status: any;
        isOnDuty: any;
        phoneNumber: any;
        activeAssignments: number;
        currentLocation: {
            latitude: number;
            longitude: number;
        } | null;
        lastLocationAt: any;
    }[]>;
    updateUnitStatus(user: AuthenticatedUser, unitId: string, status: string): Promise<{
        success: boolean;
    }>;
    getIncidentReport(agencyId: string, startDate: string, endDate: string, format: string): Promise<{
        summary: {
            total: number;
            resolved: number;
            cancelled: number;
            averageResolutionMinutes: number | null;
        };
        incidents: {
            id: any;
            emergencyType: any;
            status: any;
            priority: any;
            callerPhone: any;
            callerName: any;
            callerVerified: any;
            locationConfidence: any;
            latitude: number | null;
            longitude: number | null;
            landmark: any;
            intakeSource: any;
            unitCallSign: any;
            unitStatus: any;
            escalationLevel: any;
            createdAt: any;
            acknowledgedAt: any;
            eventCount: number;
            lastEventAt: any;
        }[];
    }>;
    getDashboardStats(agencyId: string): Promise<{
        incidents: {
            pending: number;
            active: number;
            todayTotal: number;
            todayResolved: number;
        };
        units: {
            available: number;
            busy: number;
            total: number;
        };
    }>;
    private formatIncidentSummary;
    private formatIncidentDetails;
    private formatAssignment;
}
