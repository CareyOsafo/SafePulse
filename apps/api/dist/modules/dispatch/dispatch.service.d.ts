import { DatabaseService } from '../../database/database.service';
import { QueueService } from '../../queue/queue.service';
import { EmergencyType, IncidentPriority } from '@safepulse/shared';
import { RealtimeGateway } from '../realtime/realtime.gateway';
interface AvailableUnit {
    id: string;
    agency_id: string;
    call_sign: string;
    unit_type: string;
    distance_km: number;
}
export declare class DispatchService {
    private readonly db;
    private readonly queueService;
    private readonly realtimeGateway;
    constructor(db: DatabaseService, queueService: QueueService, realtimeGateway: RealtimeGateway);
    findAvailableUnits(emergencyType: EmergencyType, latitude: number, longitude: number, agencyId?: string, limit?: number): Promise<AvailableUnit[]>;
    dispatchIncident(incidentId: string, priority?: IncidentPriority, assignedBy?: string): Promise<void>;
    createAssignmentOffer(incidentId: string, unitId: string, timeoutSeconds: number, assignedBy?: string, isPrimary?: boolean): Promise<string>;
    private createParallelOffers;
    private createSequentialOffer;
    acceptAssignment(assignmentId: string, unitId: string): Promise<void>;
    declineAssignment(assignmentId: string, unitId: string, reason: string): Promise<void>;
    handleOfferTimeout(assignmentId: string): Promise<void>;
    private offerToNextUnit;
    private scheduleEscalation;
    handleEscalation(incidentId: string): Promise<void>;
    private notifyUnitOfOffer;
}
export {};
