import { Logger, Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { DBService } from 'src/db/db.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [ContactsController],
  providers: [ContactsService, DBService, Logger, ConfigService],
})
export class ContactsModule {}
