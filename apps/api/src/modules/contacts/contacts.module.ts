import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { DatabaseService } from '../../database/database.service';

@Module({
  controllers: [ContactsController],
  providers: [ContactsService, DatabaseService],
  exports: [ContactsService],
})
export class ContactsModule {}
