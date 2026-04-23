import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DispatchService } from './dispatch.service';
export declare class DispatchProcessor implements OnModuleInit {
    private readonly configService;
    private readonly dispatchService;
    private worker;
    constructor(configService: ConfigService, dispatchService: DispatchService);
    onModuleInit(): void;
    private handleOfferTimeout;
    private handleEscalation;
    private handleEnRouteCheck;
    private handleAutoReassign;
}
