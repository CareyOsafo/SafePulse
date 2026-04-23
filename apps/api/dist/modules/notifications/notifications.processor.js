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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsProcessor = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("bullmq");
const ioredis_1 = require("ioredis");
const shared_1 = require("@safepulse/shared");
const notifications_service_1 = require("./notifications.service");
let NotificationsProcessor = class NotificationsProcessor {
    constructor(configService, notificationsService) {
        this.configService = configService;
        this.notificationsService = notificationsService;
    }
    onModuleInit() {
        const redisUrl = this.configService.get('REDIS_URL') || 'redis://localhost:6379';
        const connection = new ioredis_1.default(redisUrl, {
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
        });
        this.worker = new bullmq_1.Worker(shared_1.QueueNames.NOTIFICATIONS, async (job) => {
            console.log(`Processing notification job: ${job.name}`, job.data);
            switch (job.name) {
                case shared_1.JobNames.SEND_NOTIFICATION:
                    await this.handleSendNotification(job.data);
                    break;
                case shared_1.JobNames.RETRY_NOTIFICATION:
                    await this.handleRetryNotification(job.data);
                    break;
                default:
                    console.warn(`Unknown notification job: ${job.name}`);
            }
        }, {
            connection,
            concurrency: 10,
        });
        this.worker.on('completed', (job) => {
            console.log(`Notification job completed: ${job.id}`);
        });
        this.worker.on('failed', (job, error) => {
            console.error(`Notification job failed: ${job?.id}`, error);
        });
    }
    async handleSendNotification(data) {
        await this.notificationsService.processNotification(data.deliveryLogId);
    }
    async handleRetryNotification(data) {
        await this.notificationsService.retryNotification(data.deliveryLogId);
    }
};
exports.NotificationsProcessor = NotificationsProcessor;
exports.NotificationsProcessor = NotificationsProcessor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        notifications_service_1.NotificationsService])
], NotificationsProcessor);
//# sourceMappingURL=notifications.processor.js.map