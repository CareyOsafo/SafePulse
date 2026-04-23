import { UnitsService } from './units.service';
import { AuthenticatedUser } from '../../auth/auth.service';
import { UpdateUnitStatusDto, DeclineAssignmentDto, UpdateIncidentStatusDto, UnitLocationDto } from './dto/unit.dto';
export declare class UnitsController {
    private readonly unitsService;
    constructor(unitsService: UnitsService);
    getMyUnit(user: AuthenticatedUser): Promise<{
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
    updateMyStatus(user: AuthenticatedUser, dto: UpdateUnitStatusDto): Promise<{
        success: boolean;
        status: import("@safepulse/shared").UnitStatus;
    }>;
    updateMyLocation(user: AuthenticatedUser, dto: UnitLocationDto): Promise<{
        success: boolean;
    }>;
    getMyAssignments(user: AuthenticatedUser, active?: boolean): Promise<{
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
    acceptAssignment(user: AuthenticatedUser, assignmentId: string): Promise<{
        success: boolean;
    }>;
    declineAssignment(user: AuthenticatedUser, assignmentId: string, dto: DeclineAssignmentDto): Promise<{
        success: boolean;
    }>;
    getAssignment(user: AuthenticatedUser, assignmentId: string): Promise<{
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
    updateIncidentStatus(user: AuthenticatedUser, incidentId: string, dto: UpdateIncidentStatusDto): Promise<{
        success: boolean;
        status: import("@safepulse/shared").IncidentStatus;
    }>;
    pingLocation(user: AuthenticatedUser, incidentId: string, dto: UnitLocationDto): Promise<{
        success: boolean;
    }>;
    resolveIncident(user: AuthenticatedUser, incidentId: string, dto?: {
        notes?: string;
    }): Promise<{
        success: boolean;
        status: import("@safepulse/shared").IncidentStatus;
    }>;
    requestBackup(user: AuthenticatedUser, incidentId: string, dto?: {
        notes?: string;
    }): Promise<{
        success: boolean;
    }>;
    cantLocate(user: AuthenticatedUser, incidentId: string, dto?: {
        notes?: string;
    }): Promise<{
        success: boolean;
    }>;
    getHistory(user: AuthenticatedUser, limit?: number, offset?: number): Promise<{
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
}
