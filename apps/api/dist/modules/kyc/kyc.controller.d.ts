import { RawBodyRequest } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { KycService } from './kyc.service';
import { AuthenticatedUser } from '../../auth/auth.service';
import { StartKycDto } from './dto/kyc.dto';
export declare class KycController {
    private readonly kycService;
    private readonly configService;
    constructor(kycService: KycService, configService: ConfigService);
    startKyc(user: AuthenticatedUser, dto: StartKycDto): Promise<{
        status: import("@safepulse/shared").KycStatus;
        verificationUrl: null;
        message: any;
    } | {
        status: import("@safepulse/shared").KycStatus;
        verificationUrl: string | null;
        message: string;
    }>;
    getStatus(user: AuthenticatedUser): Promise<{
        status: any;
        verifiedAt: any;
        failedReason: any;
        ghanaCardLast4: any;
    }>;
    retryKyc(user: AuthenticatedUser, dto: StartKycDto): Promise<{
        status: import("@safepulse/shared").KycStatus;
        verificationUrl: null;
        message: any;
    } | {
        status: import("@safepulse/shared").KycStatus;
        verificationUrl: string | null;
        message: string;
    }>;
    handleMetaMapWebhook(signature: string, body: any, req: RawBodyRequest<Request>): Promise<{
        success: boolean;
        error: string;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error?: undefined;
        message?: undefined;
    }>;
    testKyc(userId: string, dto: StartKycDto): Promise<{
        status: import("@safepulse/shared").KycStatus;
        verificationUrl: null;
        message: any;
    } | {
        status: import("@safepulse/shared").KycStatus;
        verificationUrl: string | null;
        message: string;
    }>;
    testGetStatus(userId: string): Promise<{
        status: any;
        verifiedAt: any;
        failedReason: any;
        ghanaCardLast4: any;
    }>;
}
