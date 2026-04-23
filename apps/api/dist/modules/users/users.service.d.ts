import { DatabaseService } from '../../database/database.service';
import { UpdateProfileDto, UpdateSavedPlaceDto } from './dto/user.dto';
export declare class UsersService {
    private readonly db;
    constructor(db: DatabaseService);
    getUserProfile(userId: string): Promise<{
        id: any;
        phoneNumber: any;
        fullName: any;
        profilePhotoUrl: any;
        appRole: any;
        kycStatus: any;
        ghanaCardLast4: any;
        savedPlaces: {
            home: {
                latitude: number;
                longitude: number;
                address: any;
            } | null;
            work: {
                latitude: number;
                longitude: number;
                address: any;
            } | null;
        };
        createdAt: any;
        updatedAt: any;
    }>;
    getUserById(userId: string): Promise<any>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        id: any;
        phoneNumber: any;
        fullName: any;
        profilePhotoUrl: any;
        appRole: any;
        kycStatus: any;
        ghanaCardLast4: any;
        savedPlaces: {
            home: {
                latitude: number;
                longitude: number;
                address: any;
            } | null;
            work: {
                latitude: number;
                longitude: number;
                address: any;
            } | null;
        };
        createdAt: any;
        updatedAt: any;
    }>;
    updateDeviceToken(userId: string, token: string, platform: string): Promise<{
        success: boolean;
    }>;
    updateSavedPlace(userId: string, type: 'home' | 'work', dto: UpdateSavedPlaceDto): Promise<{
        success: boolean;
    }>;
    getSavedPlaces(userId: string): Promise<{
        home: {
            latitude: number;
            longitude: number;
            address: any;
        } | null;
        work: {
            latitude: number;
            longitude: number;
            address: any;
        } | null;
    }>;
    updateLastActive(userId: string): Promise<void>;
    private formatUserProfile;
}
