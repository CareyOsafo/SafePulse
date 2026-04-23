import { DatabaseService } from '../../database/database.service';
import { QueueService } from '../../queue/queue.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { NotificationChannel } from '@safepulse/shared';
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
export declare class NotificationsService {
    private readonly db;
    private readonly queueService;
    private readonly realtimeGateway;
    private readonly pushProvider;
    private readonly whatsAppProvider;
    private readonly smsProvider;
    constructor(db: DatabaseService, queueService: QueueService, realtimeGateway: RealtimeGateway, pushProvider: PushProvider, whatsAppProvider: WhatsAppProvider, smsProvider: SmsProvider);
    sendNotification(params: SendNotificationParams): Promise<string>;
    sendWithFallback(params: Omit<SendNotificationParams, 'channel'>, deviceToken?: string): Promise<void>;
    processNotification(deliveryLogId: string): Promise<void>;
    retryNotification(deliveryLogId: string): Promise<void>;
    private sendPush;
    private sendWhatsApp;
    private sendSms;
    private markDelivered;
    private markFailed;
}
export {};
