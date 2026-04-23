import { Module } from '@nestjs/common';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { DatabaseService } from '../../database/database.service';

@Module({
  controllers: [IncidentsController],
  providers: [IncidentsService, DatabaseService],
  exports: [IncidentsService],
})
export class IncidentsModule {}
