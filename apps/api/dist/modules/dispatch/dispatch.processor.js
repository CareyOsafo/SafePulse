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
exports.DispatchProcessor = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("bullmq");
const ioredis_1 = require("ioredis");
const shared_1 = require("@safepulse/shared");
const dispatch_service_1 = require("./dispatch.service");
let DispatchProcessor = class DispatchProcessor {
    constructor(configService, dispatchService) {
        this.configService = configService;
        this.dispatchService = dispatchService;
    }
    onModuleInit() {
        const redisUrl = this.configService.get('REDIS_URL') || 'redis://localhost:6379';
        const connection = new ioredis_1.default(redisUrl, {
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
        });
        this.worker = new bullmq_1.Worker(shared_1.QueueNames.DISPATCH, async (job) => {
            console.log(`Processing dispatch job: ${job.name}`, job.data);
            switch (job.name) {
                case shared_1.JobNames.OFFER_TIMEOUT:
                    await this.handleOfferTimeout(job.data);
                    break;
                case shared_1.JobNames.ESCALATE:
                    await this.handleEscalation(job.data);
                    break;
                case shared_1.JobNames.CHECK_EN_ROUTE:
                    await this.handleEnRouteCheck(job.data);
                    break;
                case shared_1.JobNames.AUTO_REASSIGN:
                    await this.handleAutoReassign(job.data);
                    break;
                default:
                    console.warn(`Unknown dispatch job: ${job.name}`);
            }
        }, { connection });
        this.worker.on('completed', (job) => {
            console.log(`Dispatch job completed: ${job.id}`);
        });
        this.worker.on('failed', (job, error) => {
            console.error(`Dispatch job failed: ${job?.id}`, error);
        });
    }
    async handleOfferTimeout(data) {
        await this.dispatchService.handleOfferTimeout(data.assignmentId);
    }
    async handleEscalation(data) {
        await this.dispatchService.handleEscalation(data.incidentId);
    }
    async handleEnRouteCheck(data) {
        console.log(`En-route check for assignment ${data.assignmentId}`);
    }
    async handleAutoReassign(data) {
        console.log(`Auto-reassigning incident ${data.incidentId}`);
    }
};
exports.DispatchProcessor = DispatchProcessor;
exports.DispatchProcessor = DispatchProcessor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        dispatch_service_1.DispatchService])
], DispatchProcessor);
//# sourceMappingURL=dispatch.processor.js.map