import { Module, forwardRef } from '@nestjs/common';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { DatabaseService } from '../../database/database.service';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [forwardRef(() => RealtimeModule)],
  controllers: [KycController],
  providers: [KycService, DatabaseService],
  exports: [KycService],
})
export class KycModule {}
