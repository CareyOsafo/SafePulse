import { DatabaseService } from '../../database/database.service';
export declare class TrackingService {
    private readonly db;
    constructor(db: DatabaseService);
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
    } | null>;
    isTokenValid(token: string): Promise<boolean>;
}
