import { Module, forwardRef } from '@nestjs/common';
import { UnitsController } from './units.controller';
import { UnitsService } from './units.service';
import { DatabaseService } from '../../database/database.service';
import { DispatchModule } from '../dispatch/dispatch.module';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [forwardRef(() => DispatchModule), forwardRef(() => RealtimeModule)],
  controllers: [UnitsController],
  providers: [UnitsService, DatabaseService],
  exports: [UnitsService],
})
export class UnitsModule {}
