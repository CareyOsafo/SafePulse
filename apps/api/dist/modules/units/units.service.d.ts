import { DatabaseService } from '../../database/database.service';
import { DispatchService } from '../dispatch/dispatch.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { UnitStatus, IncidentStatus } from '@safepulse/shared';
import { UpdateUnitStatusDto, UpdateIncidentStatusDto, UnitLocationDto } from './dto/unit.dto';
export declare class UnitsService {
    private readonly db;
    private readonly dispatchService;
    private readonly realtimeGateway;
    constructor(db: DatabaseService, dispatchService: DispatchService, realtimeGateway: RealtimeGateway);
    getUnitByUserId(userId: string): Promise<{
        id: any;
        agencyId: any;
        agencyName: any;
        callSign: any;
        unitType: any;
        status: any;
        isOnDuty: any;
        phoneNumber: any;
        currentLocation: {
            latitude: number;
            longitude: number;
            accuracy: number | null;
        } | null;
        lastLocationAt: any;
    }>;
    getUnitById(unitId: string): Promise<{
        id: any;
        agencyId: any;
        agencyName: any;
        callSign: any;
        unitType: any;
        status: any;
        isOnDuty: any;
        phoneNumber: any;
        currentLocation: {
            latitude: number;
            longitude: number;
            accuracy: number | null;
        } | null;
        lastLocationAt: any;
    }>;
    updateUnitStatus(unitId: string, dto: UpdateUnitStatusDto): Promise<{
        success: boolean;
        status: UnitStatus;
    }>;
    updateUnitLocation(unitId: string, dto: UnitLocationDto): Promise<{
        success: boolean;
    }>;
    getUnitAssignments(unitId: string, activeOnly?: boolean): Promise<{
        id: any;
        incidentId: any;
        status: any;
        offeredAt: any;
        respondedAt: any;
        expiresAt: any;
        isPrimary: any;
        incident: {
            emergencyType: any;
            status: any;
            priority: any;
            callerPhone: any;
            callerName: any;
            latitude: number | null;
            longitude: number | null;
            landmark: any;
            createdAt: any;
        };
    }[]>;
    acceptAssignment(unitId: string, assignmentId: string): Promise<{
        success: boolean;
    }>;
    declineAssignment(unitId: string, assignmentId: string, reason: string): Promise<{
        success: boolean;
    }>;
    getAssignmentDetails(unitId: string, assignmentId: string): Promise<{
        incident: {
            id: any;
            emergencyType: any;
            status: any;
            priority: any;
            callerPhone: any;
            callerName: any;
            description: any;
            notes: any;
            latitude: number | null;
            longitude: number | null;
            accuracy: number | null;
            landmark: any;
            locationUpdatedAt: any;
            createdAt: any;
        };
        id: any;
        incidentId: any;
        status: any;
        offeredAt: any;
        respondedAt: any;
        expiresAt: any;
        isPrimary: any;
    }>;
    updateIncidentStatus(unitId: string, incidentId: string, dto: UpdateIncidentStatusDto): Promise<{
        success: boolean;
        status: IncidentStatus;
    }>;
    recordLocationPing(unitId: string, incidentId: string, dto: UnitLocationDto): Promise<{
        success: boolean;
    }>;
    resolveIncident(unitId: string, incidentId: string, notes?: string): Promise<{
        success: boolean;
        status: IncidentStatus;
    }>;
    requestBackup(unitId: string, incidentId: string, notes?: string): Promise<{
        success: boolean;
    }>;
    reportCantLocate(unitId: string, incidentId: string, notes?: string): Promise<{
        success: boolean;
    }>;
    getAssignmentHistory(unitId: string, limit: number, offset: number): Promise<{
        id: any;
        incidentId: any;
        status: any;
        offeredAt: any;
        respondedAt: any;
        expiresAt: any;
        isPrimary: any;
        incident: {
            emergencyType: any;
            status: any;
            priority: any;
            callerPhone: any;
            callerName: any;
            latitude: number | null;
            longitude: number | null;
            landmark: any;
            createdAt: any;
        };
    }[]>;
    private formatUnit;
    private formatAssignment;
    private formatAssignmentDetails;
}
