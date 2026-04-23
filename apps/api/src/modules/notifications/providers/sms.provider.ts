import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface SendResult {
  success: boolean;
  providerMessageId?: string;
  error?: string;
}

@Injectable()
export class SmsProvider {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Send SMS message
   * This is a stub implementation - replace with actual provider (Twilio, Africa's Talking, etc.)
   */
  async send(phoneNumber: string, message: string): Promise<SendResult> {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

    if (!isProduction) {
      console.log('[SMS STUB] Sending SMS:', {
        to: phoneNumber,
        message: message.substring(0, 50) + '...',
      });

      // Simulate success in development
      return {
        success: true,
        providerMessageId: `sms-${Date.now()}`,
      };
    }

    // In production, implement actual SMS provider logic
    // Example for Twilio:
    /*
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    const fromNumber = this.configService.get<string>('TWILIO_SMS_FROM');

    const client = require('twilio')(accountSid, authToken);

    try {
      const result = await client.messages.create({
        body: message,
        from: fromNumber,
        to: phoneNumber,
      });

      return { success: true, providerMessageId: result.sid };
    } catch (error) {
      return { success: false, error: error.message };
    }
    */

    // Example for Africa's Talking (popular in Ghana):
    /*
    const apiKey = this.configService.get<string>('AT_API_KEY');
    const username = this.configService.get<string>('AT_USERNAME');
    const senderId = this.configService.get<string>('AT_SENDER_ID');

    const AfricasTalking = require('africastalking')({
      apiKey,
      username,
    });

    const sms = AfricasTalking.SMS;

    try {
      const result = await sms.send({
        to: [phoneNumber],
        message,
        from: senderId,
      });

      const messageData = result.SMSMessageData.Recipients[0];

      if (messageData.status === 'Success') {
        return { success: true, providerMessageId: messageData.messageId };
      } else {
        return { success: false, error: messageData.status };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
    */

    return {
      success: false,
      error: 'SMS provider not configured for production',
    };
  }
}
