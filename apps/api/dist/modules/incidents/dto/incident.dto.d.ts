import { EmergencyType, IncidentPriority, LocationSource, LocationConfidence } from '@safepulse/shared';
export declare class CoordinatesDto {
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number;
    heading?: number;
    speed?: number;
}
export declare class LocationBundleDto {
    coordinates: CoordinatesDto;
    source: LocationSource;
    confidence?: LocationConfidence;
    timestamp?: string;
    landmark?: string;
    savedPlaceId?: string;
    savedPlaceName?: string;
}
export declare class CreateIncidentDto {
    emergencyType: EmergencyType;
    location: LocationBundleDto;
    priority?: IncidentPriority;
    description?: string;
}
export declare class UpdateLocationDto {
    coordinates: CoordinatesDto;
    source?: LocationSource;
}
