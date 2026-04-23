import { IncidentStatus, EmergencyType, IncidentPriority, NotificationChannel } from '@safepulse/shared';
export declare class IncidentFiltersDto {
    status?: IncidentStatus[];
    type?: EmergencyType[];
    priority?: IncidentPriority[];
    region?: string;
    limit?: number;
    offset?: number;
}
export declare class AcknowledgeIncidentDto {
    notes?: string;
    autoDispatch?: boolean;
}
export declare class UpdateIncidentStatusDto {
    status: IncidentStatus;
    reason?: string;
}
export declare class AddNotesDto {
    notes: string;
}
export declare class AssignUnitDto {
    unitId: string;
    isPrimary?: boolean;
}
export declare class SendMessageDto {
    recipientPhone: string;
    message: string;
    channel: NotificationChannel;
}
