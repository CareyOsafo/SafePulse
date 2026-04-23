import { Module, forwardRef } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { DispatchProcessor } from './dispatch.processor';
import { DatabaseService } from '../../database/database.service';
import { UnitsModule } from '../units/units.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [
    forwardRef(() => UnitsModule),
    forwardRef(() => NotificationsModule),
    forwardRef(() => RealtimeModule),
  ],
  providers: [DispatchService, DispatchProcessor, DatabaseService],
  exports: [DispatchService],
})
export class DispatchModule {}
