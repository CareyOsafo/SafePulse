import { Queue, Job } from 'bullmq';
export declare class QueueService {
    private readonly dispatchQueue;
    private readonly notificationsQueue;
    private readonly cleanupQueue;
    constructor(dispatchQueue: Queue, notificationsQueue: Queue, cleanupQueue: Queue);
    scheduleOfferTimeout(assignmentId: string, delayMs: number): Promise<Job>;
    cancelOfferTimeout(assignmentId: string): Promise<void>;
    scheduleEscalation(incidentId: string, delayMs: number): Promise<Job>;
    cancelEscalation(incidentId: string): Promise<void>;
    scheduleEnRouteCheck(assignmentId: string, incidentId: string, delayMs: number): Promise<Job>;
    scheduleAutoReassign(incidentId: string, delayMs: number): Promise<Job>;
    sendNotification(data: {
        deliveryLogId: string;
        channel: string;
        recipientPhone: string;
        messageContent: string;
        messageType: string;
        incidentId?: string;
    }): Promise<Job>;
    retryNotification(deliveryLogId: string, delayMs: number): Promise<Job>;
    scheduleTrackingTokenExpiry(): Promise<Job>;
    scheduleSessionCleanup(): Promise<Job>;
}
