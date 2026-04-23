import { Module, Global, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import {
  DISPATCH_QUEUE,
  NOTIFICATIONS_QUEUE,
  CLEANUP_QUEUE,
  QUEUE_NAMES,
} from './queue.constants';
import { QueueService } from './queue.service';

// Re-export for backwards compatibility
export { DISPATCH_QUEUE, NOTIFICATIONS_QUEUE, CLEANUP_QUEUE };

const createRedisConnection = (redisUrl: string) => {
  return new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
  });
};

const createQueueFactory = (queueName: string, token: string) => ({
  provide: token,
  useFactory: (configService: ConfigService) => {
    const logger = new Logger(`QueueModule:${token}`);
    try {
      const redisUrl = configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
      logger.log(`Creating queue "${queueName}" with Redis URL: ${redisUrl}`);
      const connection = createRedisConnection(redisUrl);
      const queue = new Queue(queueName, { connection });
      logger.log(`Queue "${queueName}" created successfully`);
      return queue;
    } catch (error) {
      logger.error(`Failed to create queue "${queueName}":`, error);
      throw error;
    }
  },
  inject: [ConfigService],
});

@Global()
@Module({
  providers: [
    createQueueFactory(QUEUE_NAMES.DISPATCH, DISPATCH_QUEUE),
    createQueueFactory(QUEUE_NAMES.NOTIFICATIONS, NOTIFICATIONS_QUEUE),
    createQueueFactory(QUEUE_NAMES.CLEANUP, CLEANUP_QUEUE),
    QueueService,
  ],
  exports: [DISPATCH_QUEUE, NOTIFICATIONS_QUEUE, CLEANUP_QUEUE, QueueService],
})
export class QueueModule {}
