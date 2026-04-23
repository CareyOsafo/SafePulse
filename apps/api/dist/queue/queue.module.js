"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueModule = exports.CLEANUP_QUEUE = exports.NOTIFICATIONS_QUEUE = exports.DISPATCH_QUEUE = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("bullmq");
const ioredis_1 = require("ioredis");
const queue_constants_1 = require("./queue.constants");
Object.defineProperty(exports, "DISPATCH_QUEUE", { enumerable: true, get: function () { return queue_constants_1.DISPATCH_QUEUE; } });
Object.defineProperty(exports, "NOTIFICATIONS_QUEUE", { enumerable: true, get: function () { return queue_constants_1.NOTIFICATIONS_QUEUE; } });
Object.defineProperty(exports, "CLEANUP_QUEUE", { enumerable: true, get: function () { return queue_constants_1.CLEANUP_QUEUE; } });
const queue_service_1 = require("./queue.service");
const createRedisConnection = (redisUrl) => {
    return new ioredis_1.default(redisUrl, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        lazyConnect: true,
    });
};
const createQueueFactory = (queueName, token) => ({
    provide: token,
    useFactory: (configService) => {
        const logger = new common_1.Logger(`QueueModule:${token}`);
        try {
            const redisUrl = configService.get('REDIS_URL') || 'redis://localhost:6379';
            logger.log(`Creating queue "${queueName}" with Redis URL: ${redisUrl}`);
            const connection = createRedisConnection(redisUrl);
            const queue = new bullmq_1.Queue(queueName, { connection });
            logger.log(`Queue "${queueName}" created successfully`);
            return queue;
        }
        catch (error) {
            logger.error(`Failed to create queue "${queueName}":`, error);
            throw error;
        }
    },
    inject: [config_1.ConfigService],
});
let QueueModule = class QueueModule {
};
exports.QueueModule = QueueModule;
exports.QueueModule = QueueModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            createQueueFactory(queue_constants_1.QUEUE_NAMES.DISPATCH, queue_constants_1.DISPATCH_QUEUE),
            createQueueFactory(queue_constants_1.QUEUE_NAMES.NOTIFICATIONS, queue_constants_1.NOTIFICATIONS_QUEUE),
            createQueueFactory(queue_constants_1.QUEUE_NAMES.CLEANUP, queue_constants_1.CLEANUP_QUEUE),
            queue_service_1.QueueService,
        ],
        exports: [queue_constants_1.DISPATCH_QUEUE, queue_constants_1.NOTIFICATIONS_QUEUE, queue_constants_1.CLEANUP_QUEUE, queue_service_1.QueueService],
    })
], QueueModule);
//# sourceMappingURL=queue.module.js.map