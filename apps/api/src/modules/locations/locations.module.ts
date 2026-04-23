import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { DatabaseService } from '../../database/database.service';

@Module({
  providers: [LocationsService, DatabaseService],
  exports: [LocationsService],
})
export class LocationsModule {}
