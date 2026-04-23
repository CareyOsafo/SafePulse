import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/database.service';
import { AppRole } from '@safepulse/shared';
export interface JwtPayload {
    sub: string;
    aud: string;
    exp: number;
    iat: number;
    iss: string;
    phone?: string;
    email?: string;
    role?: string;
}
export interface AuthenticatedUser {
    id: string;
    supabaseUid: string;
    phoneNumber: string | null;
    email: string | null;
    fullName: string | null;
    appRole: AppRole;
    agencyId?: string;
    unitId?: string;
}
export declare class AuthService implements OnModuleInit {
    private readonly configService;
    private readonly db;
    private jwks;
    private supabaseProjectRef;
    constructor(configService: ConfigService, db: DatabaseService);
    onModuleInit(): Promise<void>;
    private initializeJwks;
    verifyToken(token: string): Promise<JwtPayload>;
    getAuthenticatedUser(supabaseUid: string): Promise<AuthenticatedUser | null>;
    autoProvisionUser(payload: JwtPayload): Promise<AuthenticatedUser>;
    createOrUpdateUser(supabaseUid: string, phoneNumber?: string, fullName?: string, email?: string): Promise<AuthenticatedUser>;
}
