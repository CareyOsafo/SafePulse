import { Module, forwardRef } from '@nestjs/common';
import { UssdController } from './ussd.controller';
import { UssdService } from './ussd.service';
import { DatabaseService } from '../../database/database.service';
import { IncidentsModule } from '../incidents/incidents.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [forwardRef(() => IncidentsModule), UsersModule],
  controllers: [UssdController],
  providers: [UssdService, DatabaseService],
  exports: [UssdService],
})
export class UssdModule {}
