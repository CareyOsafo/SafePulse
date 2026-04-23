import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { QueueNames, JobNames } from '@safepulse/shared';
import { NotificationsService } from './notifications.service';

@Injectable()
export class NotificationsProcessor implements OnModuleInit {
  private worker: Worker;

  constructor(
    private readonly configService: ConfigService,
    private readonly notificationsService: NotificationsService,
  ) {}

  onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
    const connection = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });

    this.worker = new Worker(
      QueueNames.NOTIFICATIONS,
      async (job: Job) => {
        console.log(`Processing notification job: ${job.name}`, job.data);

        switch (job.name) {
          case JobNames.SEND_NOTIFICATION:
            await this.handleSendNotification(job.data);
            break;
          case JobNames.RETRY_NOTIFICATION:
            await this.handleRetryNotification(job.data);
            break;
          default:
            console.warn(`Unknown notification job: ${job.name}`);
        }
      },
      {
        connection,
        concurrency: 10,
      },
    );

    this.worker.on('completed', (job) => {
      console.log(`Notification job completed: ${job.id}`);
    });

    this.worker.on('failed', (job, error) => {
      console.error(`Notification job failed: ${job?.id}`, error);
    });
  }

  private async handleSendNotification(data: {
    deliveryLogId: string;
    channel: string;
    recipientPhone: string;
    messageContent: string;
    messageType: string;
    incidentId?: string;
  }) {
    await this.notificationsService.processNotification(data.deliveryLogId);
  }

  private async handleRetryNotification(data: { deliveryLogId: string }) {
    await this.notificationsService.retryNotification(data.deliveryLogId);
  }
}
