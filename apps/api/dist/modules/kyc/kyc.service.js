"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const database_service_1 = require("../../database/database.service");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const shared_1 = require("@safepulse/shared");
let KycService = class KycService {
    constructor(db, configService, realtimeGateway) {
        this.db = db;
        this.configService = configService;
        this.realtimeGateway = realtimeGateway;
        this.ghanaCardSecret = this.configService.get('GHANA_CARD_HASH_SECRET') || 'dev-secret';
        this.metamapWebhookSecret = this.configService.get('METAMAP_WEBHOOK_SECRET') || '';
        this.metamapApiKey = this.configService.get('METAMAP_API_KEY') || '';
    }
    async startVerification(userId, dto) {
        if (!shared_1.Validation.ghanaCardRegex.test(dto.ghanaCardNumber)) {
            throw new common_1.BadRequestException('Invalid Ghana Card number format. Expected: GHA-XXXXXXXXX-X');
        }
        const user = await this.db.queryOne(`SELECT kyc_status, ghana_card_hash FROM users WHERE id = $1`, [userId]);
        if (user?.kyc_status === shared_1.KycStatus.VERIFIED) {
            throw new common_1.BadRequestException('Account already verified');
        }
        const ghanaCardHash = this.hashGhanaCard(dto.ghanaCardNumber);
        const ghanaCardLast4 = dto.ghanaCardNumber.slice(-4);
        const existing = await this.db.queryOne(`SELECT id FROM users WHERE ghana_card_hash = $1 AND id != $2`, [ghanaCardHash, userId]);
        if (existing) {
            throw new common_1.ConflictException('This Ghana Card is already registered with another account');
        }
        await this.db.query(`UPDATE users SET
        kyc_status = $1,
        ghana_card_hash = $2,
        ghana_card_last4 = $3,
        updated_at = NOW()
       WHERE id = $4`, [shared_1.KycStatus.PENDING, ghanaCardHash, ghanaCardLast4, userId]);
        const verificationUrl = await this.createVerificationSession(userId, dto.ghanaCardNumber);
        const updatedUser = await this.db.queryOne(`SELECT kyc_status, kyc_failed_reason FROM users WHERE id = $1`, [userId]);
        if (updatedUser?.kyc_status === shared_1.KycStatus.VERIFIED) {
            return {
                status: shared_1.KycStatus.VERIFIED,
                verificationUrl: null,
                message: 'Ghana Card verified successfully',
            };
        }
        if (updatedUser?.kyc_status === shared_1.KycStatus.FAILED) {
            return {
                status: shared_1.KycStatus.FAILED,
                verificationUrl: null,
                message: updatedUser.kyc_failed_reason || 'Ghana Card verification failed',
            };
        }
        return {
            status: shared_1.KycStatus.PENDING,
            verificationUrl,
            message: verificationUrl
                ? 'Please complete identity verification'
                : 'Verification in progress. You will be notified when complete.',
        };
    }
    async getStatus(userId) {
        const user = await this.db.queryOne(`SELECT kyc_status, kyc_verified_at, kyc_failed_reason, ghana_card_last4
       FROM users WHERE id = $1`, [userId]);
        return {
            status: user?.kyc_status || shared_1.KycStatus.NOT_STARTED,
            verifiedAt: user?.kyc_verified_at,
            failedReason: user?.kyc_failed_reason,
            ghanaCardLast4: user?.ghana_card_last4,
        };
    }
    async retryVerification(userId, dto) {
        const user = await this.db.queryOne(`SELECT kyc_status FROM users WHERE id = $1`, [userId]);
        if (user?.kyc_status === shared_1.KycStatus.VERIFIED) {
            throw new common_1.BadRequestException('Account already verified');
        }
        if (user?.kyc_status === shared_1.KycStatus.PENDING) {
            throw new common_1.BadRequestException('Verification already in progress');
        }
        return this.startVerification(userId, dto);
    }
    async handleWebhook(signature, body, rawBody) {
        if (!this.verifyWebhookSignature(signature, rawBody)) {
            console.warn('Invalid MetaMap webhook signature');
            return { success: false, error: 'Invalid signature' };
        }
        const eventId = body.eventId || body.id;
        const existing = await this.db.queryOne(`SELECT id FROM webhook_events WHERE provider = 'metamap' AND event_id = $1`, [eventId]);
        if (existing) {
            return { success: true, message: 'Already processed' };
        }
        await this.db.query(`INSERT INTO webhook_events (provider, event_id, event_type, payload)
       VALUES ('metamap', $1, $2, $3)`, [eventId, body.eventName || body.type, JSON.stringify(body)]);
        const eventType = body.eventName || body.type;
        if (eventType === 'verification_completed' || eventType === 'step_completed') {
            await this.processVerificationResult(body);
        }
        await this.db.query(`UPDATE webhook_events SET processed = true, processed_at = NOW()
       WHERE provider = 'metamap' AND event_id = $1`, [eventId]);
        return { success: true };
    }
    async createVerificationSession(userId, ghanaCardNumber) {
        const isProduction = this.configService.get('NODE_ENV') === 'production';
        if (!isProduction && !this.metamapApiKey) {
            console.log('[METAMAP STUB] Creating verification session for user:', userId);
            const verificationId = `stub-${Date.now()}`;
            await this.db.query(`UPDATE users SET kyc_verification_id = $1 WHERE id = $2`, [verificationId, userId]);
            return `http://localhost:4000/api/v1/kyc/stub-verify?userId=${userId}&vid=${verificationId}`;
        }
        try {
            const response = await fetch('https://api.prod.metamap.com/govchecks/v1/gh/verify-card', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.metamapApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    documentNumber: ghanaCardNumber,
                    callbackUrl: `${this.configService.get('FRONTEND_TRACKING_URL')?.replace('/t', '')}/api/v1/kyc/webhooks/metamap`,
                    metadata: {
                        userId,
                    },
                }),
            });
            const result = await response.json();
            if (!response.ok) {
                console.error('[METAMAP] API error:', result);
                throw new Error(result.message || 'Ghana Card verification failed');
            }
            const verificationId = result.id || result.verificationId || `metamap-${Date.now()}`;
            await this.db.query(`UPDATE users SET kyc_verification_id = $1 WHERE id = $2`, [verificationId, userId]);
            if (result.status === 'verified' || result.valid === true) {
                await this.processDirectVerificationResult(userId, true, result);
            }
            else if (result.status === 'failed' || result.valid === false) {
                await this.processDirectVerificationResult(userId, false, result);
            }
            return result.url || null;
        }
        catch (error) {
            console.error('[METAMAP] Verification error:', error);
            throw error;
        }
    }
    async processDirectVerificationResult(userId, isVerified, apiResponse) {
        const failedReason = !isVerified
            ? (apiResponse.reason || apiResponse.message || 'Ghana Card verification failed')
            : null;
        await this.db.query(`UPDATE users SET
        kyc_status = $1,
        kyc_verified_at = $2,
        kyc_failed_reason = $3,
        updated_at = NOW()
       WHERE id = $4`, [
            isVerified ? shared_1.KycStatus.VERIFIED : shared_1.KycStatus.FAILED,
            isVerified ? new Date() : null,
            failedReason,
            userId,
        ]);
        this.realtimeGateway.emitToUser(userId, 'kyc:status_updated', {
            status: isVerified ? shared_1.KycStatus.VERIFIED : shared_1.KycStatus.FAILED,
            failedReason,
            verifiedData: isVerified ? {
                fullName: apiResponse.fullName || apiResponse.name,
                dateOfBirth: apiResponse.dateOfBirth || apiResponse.dob,
            } : null,
        });
    }
    async processVerificationResult(body) {
        const verificationId = body.resource?.id || body.verificationId;
        const status = body.resource?.status || body.status;
        const user = await this.db.queryOne(`SELECT id FROM users WHERE kyc_verification_id = $1`, [verificationId]);
        if (!user) {
            console.warn('User not found for verification:', verificationId);
            return;
        }
        const isVerified = status === 'verified' || status === 'reviewCompleted';
        const failedReason = !isVerified ? (body.resource?.failureReason || 'Verification failed') : null;
        await this.db.query(`UPDATE users SET
        kyc_status = $1,
        kyc_verified_at = $2,
        kyc_failed_reason = $3,
        updated_at = NOW()
       WHERE id = $4`, [
            isVerified ? shared_1.KycStatus.VERIFIED : shared_1.KycStatus.FAILED,
            isVerified ? new Date() : null,
            failedReason,
            user.id,
        ]);
        this.realtimeGateway.emitToUser(user.id, 'kyc:status_updated', {
            status: isVerified ? shared_1.KycStatus.VERIFIED : shared_1.KycStatus.FAILED,
            failedReason,
        });
    }
    hashGhanaCard(ghanaCardNumber) {
        return (0, crypto_1.createHmac)('sha256', this.ghanaCardSecret)
            .update(ghanaCardNumber.toUpperCase())
            .digest('hex');
    }
    verifyWebhookSignature(signature, rawBody) {
        if (!this.metamapWebhookSecret || !rawBody) {
            return this.configService.get('NODE_ENV') !== 'production';
        }
        const expectedSignature = (0, crypto_1.createHmac)('sha256', this.metamapWebhookSecret)
            .update(rawBody)
            .digest('hex');
        return signature === expectedSignature;
    }
    async simulateVerification(userId, success) {
        const status = success ? shared_1.KycStatus.VERIFIED : shared_1.KycStatus.FAILED;
        const failedReason = success ? null : 'Simulated verification failure';
        await this.db.query(`UPDATE users SET
        kyc_status = $1,
        kyc_verified_at = $2,
        kyc_failed_reason = $3,
        updated_at = NOW()
       WHERE id = $4`, [status, success ? new Date() : null, failedReason, userId]);
        this.realtimeGateway.emitToUser(userId, 'kyc:status_updated', {
            status,
            failedReason,
        });
        return { success: true, status };
    }
};
exports.KycService = KycService;
exports.KycService = KycService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => realtime_gateway_1.RealtimeGateway))),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        config_1.ConfigService,
        realtime_gateway_1.RealtimeGateway])
], KycService);
//# sourceMappingURL=kyc.service.js.map