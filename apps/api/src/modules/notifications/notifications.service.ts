import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { QueueService } from '../../queue/queue.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { NotificationChannel, DeliveryStatus } from '@safepulse/shared';
import { PushProvider } from './providers/push.provider';
import { WhatsAppProvider } from './providers/whatsapp.provider';
import { SmsProvider } from './providers/sms.provider';

interface SendNotificationParams {
  incidentId?: string;
  userId?: string;
  recipientPhone: string;
  recipientName?: string;
  channel: NotificationChannel;
  messageType: string;
  messageContent: string;
}

interface SendResult {
  success: boolean;
  providerMessageId?: string;
  error?: string;
}

@Injectable()
export class NotificationsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly queueService: QueueService,
    @Inject(forwardRef(() => RealtimeGateway))
    private readonly realtimeGateway: RealtimeGateway,
    private readonly pushProvider: PushProvider,
    private readonly whatsAppProvider: WhatsAppProvider,
    private readonly smsProvider: SmsProvider,
  ) {}

  async sendNotification(params: SendNotificationParams): Promise<string> {
    // Create delivery log
    const log = await this.db.mutateOne<{ id: string }>(
      `INSERT INTO delivery_logs (
        incident_id, user_id, recipient_phone, recipient_name,
        channel, message_type, message_content, status, attempt_count
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id`,
      [
        params.incidentId,
        params.userId,
        params.recipientPhone,
        params.recipientName,
        params.channel,
        params.messageType,
        params.messageContent,
        DeliveryStatus.PENDING,
        0,
      ],
    );

    // Queue the notification for processing
    await this.queueService.sendNotification({
      deliveryLogId: log!.id,
      channel: params.channel,
      recipientPhone: params.recipientPhone,
      messageContent: params.messageContent,
      messageType: params.messageType,
      incidentId: params.incidentId,
    });

    return log!.id;
  }

  async sendWithFallback(params: Omit<SendNotificationParams, 'channel'>, deviceToken?: string): Promise<void> {
    // Try Push first if device token available
    if (deviceToken) {
      const pushLogId = await this.sendNotification({
        ...params,
        channel: NotificationChannel.PUSH,
      });

      // If push fails, it will retry and eventually fallback via the processor
    }

    // Try WhatsApp
    await this.sendNotification({
      ...params,
      channel: NotificationChannel.WHATSAPP,
    });

    // SMS as final fallback
    await this.sendNotification({
      ...params,
      channel: NotificationChannel.SMS,
    });
  }

  async processNotification(deliveryLogId: string): Promise<void> {
    const log = await this.db.queryOne(
      `SELECT * FROM delivery_logs WHERE id = $1`,
      [deliveryLogId],
    );

    if (!log) {
      return;
    }

    let result: SendResult;

    try {
      switch (log.channel) {
        case NotificationChannel.PUSH:
          result = await this.sendPush(log);
          break;
        case NotificationChannel.WHATSAPP:
          result = await this.sendWhatsApp(log);
          break;
        case NotificationChannel.SMS:
          result = await this.sendSms(log);
          break;
        default:
          result = { success: false, error: 'Unknown channel' };
      }

      if (result.success) {
        await this.markDelivered(deliveryLogId, result.providerMessageId);
      } else {
        await this.markFailed(deliveryLogId, result.error);
      }
    } catch (error) {
      await this.markFailed(deliveryLogId, (error as Error).message);
    }

    // Emit delivery result
    if (log.incident_id) {
      const updatedLog = await this.db.queryOne(
        `SELECT * FROM delivery_logs WHERE id = $1`,
        [deliveryLogId],
      );

      this.realtimeGateway.emitToIncident(log.incident_id, 'delivery:result', {
        deliveryLogId,
        channel: log.channel,
        status: updatedLog.status,
        recipientPhone: log.recipient_phone,
      });
    }
  }

  async retryNotification(deliveryLogId: string): Promise<void> {
    const log = await this.db.queryOne(
      `SELECT * FROM delivery_logs WHERE id = $1`,
      [deliveryLogId],
    );

    if (!log || log.attempt_count >= log.max_attempts) {
      return;
    }

    await this.db.query(
      `UPDATE delivery_logs SET
        attempt_count = attempt_count + 1,
        status = $1,
        updated_at = NOW()
       WHERE id = $2`,
      [DeliveryStatus.RETRYING, deliveryLogId],
    );

    await this.processNotification(deliveryLogId);
  }

  private async sendPush(log: any): Promise<SendResult> {
    // Get device token if we have user_id
    let deviceToken: string | null = null;

    if (log.user_id) {
      const user = await this.db.queryOne(
        `SELECT device_token FROM users WHERE id = $1`,
        [log.user_id],
      );
      deviceToken = user?.device_token;
    }

    if (!deviceToken) {
      return { success: false, error: 'No device token' };
    }

    return this.pushProvider.send(deviceToken, {
      title: 'SafePulse Alert',
      body: log.message_content,
      data: {
        type: log.message_type,
        incidentId: log.incident_id,
      },
    });
  }

  private async sendWhatsApp(log: any): Promise<SendResult> {
    return this.whatsAppProvider.send(log.recipient_phone, log.message_content);
  }

  private async sendSms(log: any): Promise<SendResult> {
    return this.smsProvider.send(log.recipient_phone, log.message_content);
  }

  private async markDelivered(deliveryLogId: string, providerMessageId?: string): Promise<void> {
    await this.db.query(
      `UPDATE delivery_logs SET
        status = $1,
        provider_message_id = $2,
        sent_at = NOW(),
        delivered_at = NOW(),
        updated_at = NOW()
       WHERE id = $3`,
      [DeliveryStatus.DELIVERED, providerMessageId, deliveryLogId],
    );
  }

  private async markFailed(deliveryLogId: string, errorMessage?: string): Promise<void> {
    const log = await this.db.queryOne(
      `SELECT attempt_count, max_attempts FROM delivery_logs WHERE id = $1`,
      [deliveryLogId],
    );

    if (log && log.attempt_count < log.max_attempts - 1) {
      // Schedule retry
      const delay = Math.pow(2, log.attempt_count) * 5000; // Exponential backoff
      await this.queueService.retryNotification(deliveryLogId, delay);

      await this.db.query(
        `UPDATE delivery_logs SET
          status = $1,
          error_message = $2,
          next_retry_at = NOW() + INTERVAL '${delay} milliseconds',
          updated_at = NOW()
         WHERE id = $3`,
        [DeliveryStatus.RETRYING, errorMessage, deliveryLogId],
      );
    } else {
      await this.db.query(
        `UPDATE delivery_logs SET
          status = $1,
          error_message = $2,
          failed_at = NOW(),
          updated_at = NOW()
         WHERE id = $3`,
        [DeliveryStatus.FAILED, errorMessage, deliveryLogId],
      );
    }
  }
}
