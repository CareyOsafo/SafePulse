import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { QueueNames, JobNames } from '@safepulse/shared';
import { DispatchService } from './dispatch.service';

@Injectable()
export class DispatchProcessor implements OnModuleInit {
  private worker: Worker;

  constructor(
    private readonly configService: ConfigService,
    private readonly dispatchService: DispatchService,
  ) {}

  onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
    const connection = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });

    this.worker = new Worker(
      QueueNames.DISPATCH,
      async (job: Job) => {
        console.log(`Processing dispatch job: ${job.name}`, job.data);

        switch (job.name) {
          case JobNames.OFFER_TIMEOUT:
            await this.handleOfferTimeout(job.data);
            break;
          case JobNames.ESCALATE:
            await this.handleEscalation(job.data);
            break;
          case JobNames.CHECK_EN_ROUTE:
            await this.handleEnRouteCheck(job.data);
            break;
          case JobNames.AUTO_REASSIGN:
            await this.handleAutoReassign(job.data);
            break;
          default:
            console.warn(`Unknown dispatch job: ${job.name}`);
        }
      },
      { connection },
    );

    this.worker.on('completed', (job) => {
      console.log(`Dispatch job completed: ${job.id}`);
    });

    this.worker.on('failed', (job, error) => {
      console.error(`Dispatch job failed: ${job?.id}`, error);
    });
  }

  private async handleOfferTimeout(data: { assignmentId: string }) {
    await this.dispatchService.handleOfferTimeout(data.assignmentId);
  }

  private async handleEscalation(data: { incidentId: string }) {
    await this.dispatchService.handleEscalation(data.incidentId);
  }

  private async handleEnRouteCheck(data: { assignmentId: string; incidentId: string }) {
    // Check if unit has marked themselves en route
    // If not, alert dispatcher and optionally reassign
    console.log(`En-route check for assignment ${data.assignmentId}`);
    // Implementation would check unit status and emit alerts
  }

  private async handleAutoReassign(data: { incidentId: string }) {
    // Trigger reassignment for incident
    console.log(`Auto-reassigning incident ${data.incidentId}`);
    // Implementation would restart dispatch process
  }
}
