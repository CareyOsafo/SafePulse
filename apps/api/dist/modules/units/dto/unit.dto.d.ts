import { UnitStatus, IncidentStatus } from '@safepulse/shared';
export declare class UpdateUnitStatusDto {
    status: UnitStatus;
    isOnDuty?: boolean;
}
export declare class DeclineAssignmentDto {
    reason: string;
}
export declare class UpdateIncidentStatusDto {
    status: IncidentStatus;
    notes?: string;
}
export declare class UnitLocationDto {
    latitude: number;
    longitude: number;
    accuracy?: number;
    heading?: number;
    speed?: number;
}
export declare class AcceptAssignmentDto {
    assignmentId: string;
}
