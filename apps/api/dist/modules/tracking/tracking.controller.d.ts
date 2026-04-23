import { TrackingService } from './tracking.service';
export declare class TrackingController {
    private readonly trackingService;
    constructor(trackingService: TrackingService);
    getTrackingInfo(token: string): Promise<{
        incidentId: any;
        emergencyType: any;
        status: any;
        priority: any;
        createdAt: any;
        acknowledgedAt: any;
        dispatchedAt: any;
        resolvedAt: any;
        respondingUnit: {
            callSign: any;
            type: any;
        } | null;
        location: {
            latitude: number;
            longitude: number;
            accuracy: number | null;
            updatedAt: any;
        } | null;
        timeline: {
            event: any;
            timestamp: any;
        }[];
    }>;
}
