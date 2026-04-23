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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/database.service");
const queue_service_1 = require("../../queue/queue.service");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const shared_1 = require("@safepulse/shared");
const push_provider_1 = require("./providers/push.provider");
const whatsapp_provider_1 = require("./providers/whatsapp.provider");
const sms_provider_1 = require("./providers/sms.provider");
let NotificationsService = class NotificationsService {
    constructor(db, queueService, realtimeGateway, pushProvider, whatsAppProvider, smsProvider) {
        this.db = db;
        this.queueService = queueService;
        this.realtimeGateway = realtimeGateway;
        this.pushProvider = pushProvider;
        this.whatsAppProvider = whatsAppProvider;
        this.smsProvider = smsProvider;
    }
    async sendNotification(params) {
        const log = await this.db.mutateOne(`INSERT INTO delivery_logs (
        incident_id, user_id, recipient_phone, recipient_name,
        channel, message_type, message_content, status, attempt_count
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id`, [
            params.incidentId,
            params.userId,
            params.recipientPhone,
            params.recipientName,
            params.channel,
            params.messageType,
            params.messageContent,
            shared_1.DeliveryStatus.PENDING,
            0,
        ]);
        await this.queueService.sendNotification({
            deliveryLogId: log.id,
            channel: params.channel,
            recipientPhone: params.recipientPhone,
            messageContent: params.messageContent,
            messageType: params.messageType,
            incidentId: params.incidentId,
        });
        return log.id;
    }
    async sendWithFallback(params, deviceToken) {
        if (deviceToken) {
            const pushLogId = await this.sendNotification({
                ...params,
                channel: shared_1.NotificationChannel.PUSH,
            });
        }
        await this.sendNotification({
            ...params,
            channel: shared_1.NotificationChannel.WHATSAPP,
        });
        await this.sendNotification({
            ...params,
            channel: shared_1.NotificationChannel.SMS,
        });
    }
    async processNotification(deliveryLogId) {
        const log = await this.db.queryOne(`SELECT * FROM delivery_logs WHERE id = $1`, [deliveryLogId]);
        if (!log) {
            return;
        }
        let result;
        try {
            switch (log.channel) {
                case shared_1.NotificationChannel.PUSH:
                    result = await this.sendPush(log);
                    break;
                case shared_1.NotificationChannel.WHATSAPP:
                    result = await this.sendWhatsApp(log);
                    break;
                case shared_1.NotificationChannel.SMS:
                    result = await this.sendSms(log);
                    break;
                default:
                    result = { success: false, error: 'Unknown channel' };
            }
            if (result.success) {
                await this.markDelivered(deliveryLogId, result.providerMessageId);
            }
            else {
                await this.markFailed(deliveryLogId, result.error);
            }
        }
        catch (error) {
            await this.markFailed(deliveryLogId, error.message);
        }
        if (log.incident_id) {
            const updatedLog = await this.db.queryOne(`SELECT * FROM delivery_logs WHERE id = $1`, [deliveryLogId]);
            this.realtimeGateway.emitToIncident(log.incident_id, 'delivery:result', {
                deliveryLogId,
                channel: log.channel,
                status: updatedLog.status,
                recipientPhone: log.recipient_phone,
            });
        }
    }
    async retryNotification(deliveryLogId) {
        const log = await this.db.queryOne(`SELECT * FROM delivery_logs WHERE id = $1`, [deliveryLogId]);
        if (!log || log.attempt_count >= log.max_attempts) {
            return;
        }
        await this.db.query(`UPDATE delivery_logs SET
        attempt_count = attempt_count + 1,
        status = $1,
        updated_at = NOW()
       WHERE id = $2`, [shared_1.DeliveryStatus.RETRYING, deliveryLogId]);
        await this.processNotification(deliveryLogId);
    }
    async sendPush(log) {
        let deviceToken = null;
        if (log.user_id) {
            const user = await this.db.queryOne(`SELECT device_token FROM users WHERE id = $1`, [log.user_id]);
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
    async sendWhatsApp(log) {
        return this.whatsAppProvider.send(log.recipient_phone, log.message_content);
    }
    async sendSms(log) {
        return this.smsProvider.send(log.recipient_phone, log.message_content);
    }
    async markDelivered(deliveryLogId, providerMessageId) {
        await this.db.query(`UPDATE delivery_logs SET
        status = $1,
        provider_message_id = $2,
        sent_at = NOW(),
        delivered_at = NOW(),
        updated_at = NOW()
       WHERE id = $3`, [shared_1.DeliveryStatus.DELIVERED, providerMessageId, deliveryLogId]);
    }
    async markFailed(deliveryLogId, errorMessage) {
        const log = await this.db.queryOne(`SELECT attempt_count, max_attempts FROM delivery_logs WHERE id = $1`, [deliveryLogId]);
        if (log && log.attempt_count < log.max_attempts - 1) {
            const delay = Math.pow(2, log.attempt_count) * 5000;
            await this.queueService.retryNotification(deliveryLogId, delay);
            await this.db.query(`UPDATE delivery_logs SET
          status = $1,
          error_message = $2,
          next_retry_at = NOW() + INTERVAL '${delay} milliseconds',
          updated_at = NOW()
         WHERE id = $3`, [shared_1.DeliveryStatus.RETRYING, errorMessage, deliveryLogId]);
        }
        else {
            await this.db.query(`UPDATE delivery_logs SET
          status = $1,
          error_message = $2,
          failed_at = NOW(),
          updated_at = NOW()
         WHERE id = $3`, [shared_1.DeliveryStatus.FAILED, errorMessage, deliveryLogId]);
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => realtime_gateway_1.RealtimeGateway))),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        queue_service_1.QueueService,
        realtime_gateway_1.RealtimeGateway,
        push_provider_1.PushProvider,
        whatsapp_provider_1.WhatsAppProvider,
        sms_provider_1.SmsProvider])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map