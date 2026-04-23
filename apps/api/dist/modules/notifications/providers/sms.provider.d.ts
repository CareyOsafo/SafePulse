import { ConfigService } from '@nestjs/config';
interface SendResult {
    success: boolean;
    providerMessageId?: string;
    error?: string;
}
export declare class SmsProvider {
    private readonly configService;
    constructor(configService: ConfigService);
    send(phoneNumber: string, message: string): Promise<SendResult>;
}
export {};
