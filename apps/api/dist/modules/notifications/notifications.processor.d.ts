import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from './notifications.service';
export declare class NotificationsProcessor implements OnModuleInit {
    private readonly configService;
    private readonly notificationsService;
    private worker;
    constructor(configService: ConfigService, notificationsService: NotificationsService);
    onModuleInit(): void;
    private handleSendNotification;
    private handleRetryNotification;
}
