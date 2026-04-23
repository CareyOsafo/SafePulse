import { Module, forwardRef } from '@nestjs/common';
import { DispatcherController } from './dispatcher.controller';
import { DispatcherService } from './dispatcher.service';
import { DatabaseService } from '../../database/database.service';
import { DispatchModule } from '../dispatch/dispatch.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    forwardRef(() => DispatchModule),
    forwardRef(() => RealtimeModule),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [DispatcherController],
  providers: [DispatcherService, DatabaseService],
  exports: [DispatcherService],
})
export class DispatcherModule {}
