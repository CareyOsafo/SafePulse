// Queue injection tokens - separate file to avoid circular dependencies
export const DISPATCH_QUEUE = 'DISPATCH_QUEUE';
export const NOTIFICATIONS_QUEUE = 'NOTIFICATIONS_QUEUE';
export const CLEANUP_QUEUE = 'CLEANUP_QUEUE';

// Queue names for BullMQ
export const QUEUE_NAMES = {
  DISPATCH: 'dispatch',
  NOTIFICATIONS: 'notifications',
  CLEANUP: 'cleanup',
} as const;
