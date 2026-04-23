import { Injectable, Inject } from '@nestjs/common';
import { Queue, Job } from 'bullmq';
import { DISPATCH_QUEUE, NOTIFICATIONS_QUEUE, CLEANUP_QUEUE } from './queue.constants';

// Job names - hardcoded to avoid import issues
const JobNames = {
  OFFER_TIMEOUT: 'dispatch.offer_timeout',
  ESCALATE: 'dispatch.escalate',
  CHECK_EN_ROUTE: 'dispatch.check_en_route',
  AUTO_REASSIGN: 'dispatch.auto_reassign',
  SEND_NOTIFICATION: 'notify.send',
  RETRY_NOTIFICATION: 'notify.retry',
  EXPIRE_TRACKING_TOKENS: 'cleanup.expire_tracking_tokens',
  CLEANUP_SESSIONS: 'cleanup.sessions',
} as const;

@Injectable()
export class QueueService {
  constructor(
    @Inject(DISPATCH_QUEUE) private readonly dispatchQueue: Queue,
    @Inject(NOTIFICATIONS_QUEUE) private readonly notificationsQueue: Queue,
    @Inject(CLEANUP_QUEUE) private readonly cleanupQueue: Queue,
  ) {}

  // ============================================================
  // DISPATCH JOBS
  // ============================================================

  async scheduleOfferTimeout(assignmentId: string, delayMs: number): Promise<Job> {
    return this.dispatchQueue.add(
      JobNames.OFFER_TIMEOUT,
      { assignmentId },
      {
        delay: delayMs,
        jobId: `offer-timeout-${assignmentId}`,
        removeOnComplete: true,
        removeOnFail: 100,
      },
    );
  }

  async cancelOfferTimeout(assignmentId: string): Promise<void> {
    const job = await this.dispatchQueue.getJob(`offer-timeout-${assignmentId}`);
    if (job) {
      await job.remove();
    }
  }

  async scheduleEscalation(incidentId: string, delayMs: number): Promise<Job> {
    return this.dispatchQueue.add(
      JobNames.ESCALATE,
      { incidentId },
      {
        delay: delayMs,
        jobId: `escalate-${incidentId}`,
        removeOnComplete: true,
        removeOnFail: 100,
      },
    );
  }

  async cancelEscalation(incidentId: string): Promise<void> {
    const job = await this.dispatchQueue.getJob(`escalate-${incidentId}`);
    if (job) {
      await job.remove();
    }
  }

  async scheduleEnRouteCheck(
    assignmentId: string,
    incidentId: string,
    delayMs: number,
  ): Promise<Job> {
    return this.dispatchQueue.add(
      JobNames.CHECK_EN_ROUTE,
      { assignmentId, incidentId },
      {
        delay: delayMs,
        jobId: `en-route-check-${assignmentId}`,
        removeOnComplete: true,
        removeOnFail: 100,
      },
    );
  }

  async scheduleAutoReassign(incidentId: string, delayMs: number): Promise<Job> {
    return this.dispatchQueue.add(
      JobNames.AUTO_REASSIGN,
      { incidentId },
      {
        delay: delayMs,
        jobId: `auto-reassign-${incidentId}`,
        removeOnComplete: true,
        removeOnFail: 100,
      },
    );
  }

  // ============================================================
  // NOTIFICATION JOBS
  // ============================================================

  async sendNotification(data: {
    deliveryLogId: string;
    channel: string;
    recipientPhone: string;
    messageContent: string;
    messageType: string;
    incidentId?: string;
  }): Promise<Job> {
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

  async retryNotification(deliveryLogId: string, delayMs: number): Promise<Job> {
    return this.notificationsQueue.add(
      JobNames.RETRY_NOTIFICATION,
      { deliveryLogId },
      {
        delay: delayMs,
        jobId: `retry-notification-${deliveryLogId}`,
        removeOnComplete: true,
        removeOnFail: 100,
      },
    );
  }

  // ============================================================
  // CLEANUP JOBS
  // ============================================================

  async scheduleTrackingTokenExpiry(): Promise<Job> {
    return this.cleanupQueue.add(
      JobNames.EXPIRE_TRACKING_TOKENS,
      {},
      {
        repeat: {
          pattern: '0 * * * *', // Every hour
        },
        removeOnComplete: true,
      },
    );
  }

  async scheduleSessionCleanup(): Promise<Job> {
    return this.cleanupQueue.add(
      JobNames.CLEANUP_SESSIONS,
      {},
      {
        repeat: {
          pattern: '*/15 * * * *', // Every 15 minutes
        },
        removeOnComplete: true,
      },
    );
  }
}
