import { Logger, Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { DBService } from 'src/db/db.service';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { EventHandlers } from './events';

@Module({
  imports: [CqrsModule],
  controllers: [ContactsController],
  providers: [
    ContactsService,
    DBService,
    Logger,
    ConfigService,
    ...EventHandlers,
  ],
})
export class ContactsModule {}
