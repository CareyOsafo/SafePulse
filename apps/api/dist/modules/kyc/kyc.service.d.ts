import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { KycStatus } from '@safepulse/shared';
import { StartKycDto } from './dto/kyc.dto';
export declare class KycService {
    private readonly db;
    private readonly configService;
    private readonly realtimeGateway;
    private readonly ghanaCardSecret;
    private readonly metamapWebhookSecret;
    private readonly metamapApiKey;
    constructor(db: DatabaseService, configService: ConfigService, realtimeGateway: RealtimeGateway);
    startVerification(userId: string, dto: StartKycDto): Promise<{
        status: KycStatus;
        verificationUrl: null;
        message: any;
    } | {
        status: KycStatus;
        verificationUrl: string | null;
        message: string;
    }>;
    getStatus(userId: string): Promise<{
        status: any;
        verifiedAt: any;
        failedReason: any;
        ghanaCardLast4: any;
    }>;
    retryVerification(userId: string, dto: StartKycDto): Promise<{
        status: KycStatus;
        verificationUrl: null;
        message: any;
    } | {
        status: KycStatus;
        verificationUrl: string | null;
        message: string;
    }>;
    handleWebhook(signature: string, body: any, rawBody?: Buffer): Promise<{
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
    private createVerificationSession;
    private processDirectVerificationResult;
    private processVerificationResult;
    private hashGhanaCard;
    private verifyWebhookSignature;
    simulateVerification(userId: string, success: boolean): Promise<{
        success: boolean;
        status: KycStatus;
    }>;
}
