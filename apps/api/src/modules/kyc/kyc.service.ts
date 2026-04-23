import {
  Injectable,
  BadRequestException,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import { DatabaseService } from '../../database/database.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { KycStatus, Validation } from '@safepulse/shared';
import { StartKycDto } from './dto/kyc.dto';

@Injectable()
export class KycService {
  private readonly ghanaCardSecret: string;
  private readonly metamapWebhookSecret: string;
  private readonly metamapApiKey: string;

  constructor(
    private readonly db: DatabaseService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => RealtimeGateway))
    private readonly realtimeGateway: RealtimeGateway,
  ) {
    this.ghanaCardSecret = this.configService.get<string>('GHANA_CARD_HASH_SECRET') || 'dev-secret';
    this.metamapWebhookSecret = this.configService.get<string>('METAMAP_WEBHOOK_SECRET') || '';
    this.metamapApiKey = this.configService.get<string>('METAMAP_API_KEY') || '';
  }

  async startVerification(userId: string, dto: StartKycDto) {
    // Validate Ghana Card format
    if (!Validation.ghanaCardRegex.test(dto.ghanaCardNumber)) {
      throw new BadRequestException('Invalid Ghana Card number format. Expected: GHA-XXXXXXXXX-X');
    }

    // Check current KYC status
    const user = await this.db.queryOne(
      `SELECT kyc_status, ghana_card_hash FROM users WHERE id = $1`,
      [userId],
    );

    if (user?.kyc_status === KycStatus.VERIFIED) {
      throw new BadRequestException('Account already verified');
    }

    // Generate hash for Ghana Card
    const ghanaCardHash = this.hashGhanaCard(dto.ghanaCardNumber);
    const ghanaCardLast4 = dto.ghanaCardNumber.slice(-4);

    // Check if Ghana Card is already registered
    const existing = await this.db.queryOne(
      `SELECT id FROM users WHERE ghana_card_hash = $1 AND id != $2`,
      [ghanaCardHash, userId],
    );

    if (existing) {
      throw new ConflictException('This Ghana Card is already registered with another account');
    }

    // Update user with KYC pending status
    await this.db.query(
      `UPDATE users SET
        kyc_status = $1,
        ghana_card_hash = $2,
        ghana_card_last4 = $3,
        updated_at = NOW()
       WHERE id = $4`,
      [KycStatus.PENDING, ghanaCardHash, ghanaCardLast4, userId],
    );

    // Call MetaMap Ghana Card verification API
    const verificationUrl = await this.createVerificationSession(userId, dto.ghanaCardNumber);

    // Re-fetch user to get updated status (may have been verified immediately)
    const updatedUser = await this.db.queryOne(
      `SELECT kyc_status, kyc_failed_reason FROM users WHERE id = $1`,
      [userId],
    );

    // If verification completed immediately
    if (updatedUser?.kyc_status === KycStatus.VERIFIED) {
      return {
        status: KycStatus.VERIFIED,
        verificationUrl: null,
        message: 'Ghana Card verified successfully',
      };
    }

    if (updatedUser?.kyc_status === KycStatus.FAILED) {
      return {
        status: KycStatus.FAILED,
        verificationUrl: null,
        message: updatedUser.kyc_failed_reason || 'Ghana Card verification failed',
      };
    }

    return {
      status: KycStatus.PENDING,
      verificationUrl,
      message: verificationUrl
        ? 'Please complete identity verification'
        : 'Verification in progress. You will be notified when complete.',
    };
  }

  async getStatus(userId: string) {
    const user = await this.db.queryOne(
      `SELECT kyc_status, kyc_verified_at, kyc_failed_reason, ghana_card_last4
       FROM users WHERE id = $1`,
      [userId],
    );

    return {
      status: user?.kyc_status || KycStatus.NOT_STARTED,
      verifiedAt: user?.kyc_verified_at,
      failedReason: user?.kyc_failed_reason,
      ghanaCardLast4: user?.ghana_card_last4,
    };
  }

  async retryVerification(userId: string, dto: StartKycDto) {
    const user = await this.db.queryOne(
      `SELECT kyc_status FROM users WHERE id = $1`,
      [userId],
    );

    if (user?.kyc_status === KycStatus.VERIFIED) {
      throw new BadRequestException('Account already verified');
    }

    if (user?.kyc_status === KycStatus.PENDING) {
      throw new BadRequestException('Verification already in progress');
    }

    // Reset and start again
    return this.startVerification(userId, dto);
  }

  async handleWebhook(signature: string, body: any, rawBody?: Buffer) {
    // Verify webhook signature
    if (!this.verifyWebhookSignature(signature, rawBody)) {
      console.warn('Invalid MetaMap webhook signature');
      return { success: false, error: 'Invalid signature' };
    }

    // Check for idempotency
    const eventId = body.eventId || body.id;
    const existing = await this.db.queryOne(
      `SELECT id FROM webhook_events WHERE provider = 'metamap' AND event_id = $1`,
      [eventId],
    );

    if (existing) {
      return { success: true, message: 'Already processed' };
    }

    // Store webhook event
    await this.db.query(
      `INSERT INTO webhook_events (provider, event_id, event_type, payload)
       VALUES ('metamap', $1, $2, $3)`,
      [eventId, body.eventName || body.type, JSON.stringify(body)],
    );

    // Process based on event type
    const eventType = body.eventName || body.type;

    if (eventType === 'verification_completed' || eventType === 'step_completed') {
      await this.processVerificationResult(body);
    }

    // Mark as processed
    await this.db.query(
      `UPDATE webhook_events SET processed = true, processed_at = NOW()
       WHERE provider = 'metamap' AND event_id = $1`,
      [eventId],
    );

    return { success: true };
  }

  private async createVerificationSession(userId: string, ghanaCardNumber: string): Promise<string | null> {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

    if (!isProduction && !this.metamapApiKey) {
      // Stub for development without API key
      console.log('[METAMAP STUB] Creating verification session for user:', userId);

      const verificationId = `stub-${Date.now()}`;

      await this.db.query(
        `UPDATE users SET kyc_verification_id = $1 WHERE id = $2`,
        [verificationId, userId],
      );

      return `http://localhost:4000/api/v1/kyc/stub-verify?userId=${userId}&vid=${verificationId}`;
    }

    // Call MetaMap Ghana Card verification API directly
    try {
      const response = await fetch('https://api.prod.metamap.com/govchecks/v1/gh/verify-card', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.metamapApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentNumber: ghanaCardNumber,
          callbackUrl: `${this.configService.get<string>('FRONTEND_TRACKING_URL')?.replace('/t', '')}/api/v1/kyc/webhooks/metamap`,
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

      // Store verification ID for callback matching
      const verificationId = result.id || result.verificationId || `metamap-${Date.now()}`;

      await this.db.query(
        `UPDATE users SET kyc_verification_id = $1 WHERE id = $2`,
        [verificationId, userId],
      );

      // If the API returns immediate verification result
      if (result.status === 'verified' || result.valid === true) {
        await this.processDirectVerificationResult(userId, true, result);
      } else if (result.status === 'failed' || result.valid === false) {
        await this.processDirectVerificationResult(userId, false, result);
      }

      // Return verification URL if provided (for interactive flow)
      return result.url || null;
    } catch (error) {
      console.error('[METAMAP] Verification error:', error);
      throw error;
    }
  }

  private async processDirectVerificationResult(userId: string, isVerified: boolean, apiResponse: any) {
    const failedReason = !isVerified
      ? (apiResponse.reason || apiResponse.message || 'Ghana Card verification failed')
      : null;

    await this.db.query(
      `UPDATE users SET
        kyc_status = $1,
        kyc_verified_at = $2,
        kyc_failed_reason = $3,
        updated_at = NOW()
       WHERE id = $4`,
      [
        isVerified ? KycStatus.VERIFIED : KycStatus.FAILED,
        isVerified ? new Date() : null,
        failedReason,
        userId,
      ],
    );

    // Notify user via WebSocket
    this.realtimeGateway.emitToUser(userId, 'kyc:status_updated', {
      status: isVerified ? KycStatus.VERIFIED : KycStatus.FAILED,
      failedReason,
      verifiedData: isVerified ? {
        fullName: apiResponse.fullName || apiResponse.name,
        dateOfBirth: apiResponse.dateOfBirth || apiResponse.dob,
      } : null,
    });
  }

  private async processVerificationResult(body: any) {
    const verificationId = body.resource?.id || body.verificationId;
    const status = body.resource?.status || body.status;

    // Find user by verification ID
    const user = await this.db.queryOne(
      `SELECT id FROM users WHERE kyc_verification_id = $1`,
      [verificationId],
    );

    if (!user) {
      console.warn('User not found for verification:', verificationId);
      return;
    }

    const isVerified = status === 'verified' || status === 'reviewCompleted';
    const failedReason = !isVerified ? (body.resource?.failureReason || 'Verification failed') : null;

    await this.db.query(
      `UPDATE users SET
        kyc_status = $1,
        kyc_verified_at = $2,
        kyc_failed_reason = $3,
        updated_at = NOW()
       WHERE id = $4`,
      [
        isVerified ? KycStatus.VERIFIED : KycStatus.FAILED,
        isVerified ? new Date() : null,
        failedReason,
        user.id,
      ],
    );

    // Notify user via WebSocket
    this.realtimeGateway.emitToUser(user.id, 'kyc:status_updated', {
      status: isVerified ? KycStatus.VERIFIED : KycStatus.FAILED,
      failedReason,
    });
  }

  private hashGhanaCard(ghanaCardNumber: string): string {
    return createHmac('sha256', this.ghanaCardSecret)
      .update(ghanaCardNumber.toUpperCase())
      .digest('hex');
  }

  private verifyWebhookSignature(signature: string, rawBody?: Buffer): boolean {
    if (!this.metamapWebhookSecret || !rawBody) {
      // Skip verification in development without secret
      return this.configService.get<string>('NODE_ENV') !== 'production';
    }

    const expectedSignature = createHmac('sha256', this.metamapWebhookSecret)
      .update(rawBody)
      .digest('hex');

    return signature === expectedSignature;
  }

  // Development stub endpoint to simulate verification
  async simulateVerification(userId: string, success: boolean) {
    const status = success ? KycStatus.VERIFIED : KycStatus.FAILED;
    const failedReason = success ? null : 'Simulated verification failure';

    await this.db.query(
      `UPDATE users SET
        kyc_status = $1,
        kyc_verified_at = $2,
        kyc_failed_reason = $3,
        updated_at = NOW()
       WHERE id = $4`,
      [status, success ? new Date() : null, failedReason, userId],
    );

    this.realtimeGateway.emitToUser(userId, 'kyc:status_updated', {
      status,
      failedReason,
    });

    return { success: true, status };
  }
}
