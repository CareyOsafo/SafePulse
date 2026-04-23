import { DatabaseService } from '../../database/database.service';
import { LocationSource, LocationConfidence } from '@safepulse/shared';
interface Coordinates {
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number;
    heading?: number;
    speed?: number;
}
export declare class LocationsService {
    private readonly db;
    constructor(db: DatabaseService);
    createLocationSnapshot(incidentId: string, coordinates: Coordinates, source: LocationSource, confidence: LocationConfidence, capturedAt?: Date): Promise<any>;
    getLatestLocation(incidentId: string): Promise<any>;
    getLocationHistory(incidentId: string, limit?: number): Promise<any[]>;
    calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
    private toRad;
    calculateConfidence(accuracy?: number, source?: LocationSource): LocationConfidence;
}
export {};
