import { Module } from '@nestjs/common';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { DatabaseService } from '../../database/database.service';

@Module({
  controllers: [TrackingController],
  providers: [TrackingService, DatabaseService],
  exports: [TrackingService],
})
export class TrackingModule {}
