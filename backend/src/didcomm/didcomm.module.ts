import { Logger, Module } from '@nestjs/common';
import { DIDCommService } from './didcomm.service';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { EventHandlers } from './events';
import { DIDResolverService } from 'src/dids/didresolver.service';
import { KMSService } from 'src/kms/kms.service';
import { DocumentLoaderService } from 'src/documentLoader/documentLoader.service';
import { DBService } from 'src/db/db.service';
import { CommandHandlers } from './commands';
import { DIDWebService } from 'src/didweb/didweb.service';
import { Sagas } from './sagas';
import { ContactsService } from 'src/contacts/contacts.service';
import { MessagesApiService } from 'src/messages-api/messages-api.service';

@Module({
  imports: [CqrsModule],
  providers: [
    DIDCommService,
    Logger,
    ConfigService,
    ...EventHandlers,
    ...CommandHandlers,
    ...Sagas,
    DIDResolverService,
    KMSService,
    DocumentLoaderService,
    DBService,
    DIDWebService,
    ContactsService,
    MessagesApiService,
  ],
  exports: [DIDCommService],
})
export class DIDCommModule {}
