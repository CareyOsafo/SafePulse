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
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const queue_constants_1 = require("./queue.constants");
const JobNames = {
    OFFER_TIMEOUT: 'dispatch.offer_timeout',
    ESCALATE: 'dispatch.escalate',
    CHECK_EN_ROUTE: 'dispatch.check_en_route',
    AUTO_REASSIGN: 'dispatch.auto_reassign',
    SEND_NOTIFICATION: 'notify.send',
    RETRY_NOTIFICATION: 'notify.retry',
    EXPIRE_TRACKING_TOKENS: 'cleanup.expire_tracking_tokens',
    CLEANUP_SESSIONS: 'cleanup.sessions',
};
let QueueService = class QueueService {
    constructor(dispatchQueue, notificationsQueue, cleanupQueue) {
        this.dispatchQueue = dispatchQueue;
        this.notificationsQueue = notificationsQueue;
        this.cleanupQueue = cleanupQueue;
    }
    async scheduleOfferTimeout(assignmentId, delayMs) {
        return this.dispatchQueue.add(JobNames.OFFER_TIMEOUT, { assignmentId }, {
            delay: delayMs,
            jobId: `offer-timeout-${assignmentId}`,
            removeOnComplete: true,
            removeOnFail: 100,
        });
    }
    async cancelOfferTimeout(assignmentId) {
        const job = await this.dispatchQueue.getJob(`offer-timeout-${assignmentId}`);
        if (job) {
            await job.remove();
        }
    }
    async scheduleEscalation(incidentId, delayMs) {
        return this.dispatchQueue.add(JobNames.ESCALATE, { incidentId }, {
            delay: delayMs,
            jobId: `escalate-${incidentId}`,
            removeOnComplete: true,
            removeOnFail: 100,
        });
    }
    async cancelEscalation(incidentId) {
        const job = await this.dispatchQueue.getJob(`escalate-${incidentId}`);
        if (job) {
            await job.remove();
        }
    }
    async scheduleEnRouteCheck(assignmentId, incidentId, delayMs) {
        return this.dispatchQueue.add(JobNames.CHECK_EN_ROUTE, { assignmentId, incidentId }, {
            delay: delayMs,
            jobId: `en-route-check-${assignmentId}`,
            removeOnComplete: true,
            removeOnFail: 100,
        });
    }
    async scheduleAutoReassign(incidentId, delayMs) {
        return this.dispatchQueue.add(JobNames.AUTO_REASSIGN, { incidentId }, {
            delay: delayMs,
            jobId: `auto-reassign-${incidentId}`,
            removeOnComplete: true,
            removeOnFail: 100,
        });
    }
    async sendNotification(data) {
        return this.notificationsQueue.add(JobNames.SEND_NOTIFICATION, data, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000,
            },
            removeOnComplete: 100,
            removeOnFail: 100,
        });
    }
    async retryNotification(deliveryLogId, delayMs) {
        return this.notificationsQueue.add(JobNames.RETRY_NOTIFICATION, { deliveryLogId }, {
            delay: delayMs,
            jobId: `retry-notification-${deliveryLogId}`,
            removeOnComplete: true,
            removeOnFail: 100,
        });
    }
    async scheduleTrackingTokenExpiry() {
        return this.cleanupQueue.add(JobNames.EXPIRE_TRACKING_TOKENS, {}, {
            repeat: {
                pattern: '0 * * * *',
            },
            removeOnComplete: true,
        });
    }
    async scheduleSessionCleanup() {
        return this.cleanupQueue.add(JobNames.CLEANUP_SESSIONS, {}, {
            repeat: {
                pattern: '*/15 * * * *',
            },
            removeOnComplete: true,
        });
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(queue_constants_1.DISPATCH_QUEUE)),
    __param(1, (0, common_1.Inject)(queue_constants_1.NOTIFICATIONS_QUEUE)),
    __param(2, (0, common_1.Inject)(queue_constants_1.CLEANUP_QUEUE)),
    __metadata("design:paramtypes", [bullmq_1.Queue,
        bullmq_1.Queue,
        bullmq_1.Queue])
], QueueService);
//# sourceMappingURL=queue.service.js.map