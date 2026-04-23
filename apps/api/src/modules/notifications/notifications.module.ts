import { Module, Global, forwardRef } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsProcessor } from './notifications.processor';
import { DatabaseService } from '../../database/database.service';
import { RealtimeModule } from '../realtime/realtime.module';

// Provider stubs
import { PushProvider } from './providers/push.provider';
import { WhatsAppProvider } from './providers/whatsapp.provider';
import { SmsProvider } from './providers/sms.provider';

@Global()
@Module({
  imports: [forwardRef(() => RealtimeModule)],
  providers: [
    NotificationsService,
    NotificationsProcessor,
    DatabaseService,
    PushProvider,
    WhatsAppProvider,
    SmsProvider,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
