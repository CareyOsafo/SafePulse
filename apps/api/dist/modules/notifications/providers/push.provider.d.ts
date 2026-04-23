import { ConfigService } from '@nestjs/config';
interface PushPayload {
    title: string;
    body: string;
    data?: Record<string, any>;
}
interface SendResult {
    success: boolean;
    providerMessageId?: string;
    error?: string;
}
export declare class PushProvider {
    private readonly configService;
    constructor(configService: ConfigService);
    send(deviceToken: string, payload: PushPayload): Promise<SendResult>;
}
export {};
