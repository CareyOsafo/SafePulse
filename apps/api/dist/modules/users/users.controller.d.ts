import { UsersService } from './users.service';
import { AuthenticatedUser } from '../../auth/auth.service';
import { UpdateProfileDto, UpdateSavedPlaceDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: AuthenticatedUser): Promise<{
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
    updateProfile(user: AuthenticatedUser, dto: UpdateProfileDto): Promise<{
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
    updateDeviceToken(user: AuthenticatedUser, dto: {
        token: string;
        platform: string;
    }): Promise<{
        success: boolean;
    }>;
    saveHomeLocation(user: AuthenticatedUser, dto: UpdateSavedPlaceDto): Promise<{
        success: boolean;
    }>;
    saveWorkLocation(user: AuthenticatedUser, dto: UpdateSavedPlaceDto): Promise<{
        success: boolean;
    }>;
    getSavedPlaces(user: AuthenticatedUser): Promise<{
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
}
