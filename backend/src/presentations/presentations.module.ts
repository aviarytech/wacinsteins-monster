import { Logger, Module } from '@nestjs/common';
import { PresentationsService } from './presentations.service';
import { PresentationsController } from './presentations.controller';
import { DBService } from 'src/db/db.service';
import { ConfigService } from '@nestjs/config';
import { DIDWebService } from 'src/didweb/didweb.service';
import { KMSService } from 'src/kms/kms.service';
import { DIDCommService } from 'src/didcomm/didcomm.service';
import { DIDResolverService } from 'src/dids/didresolver.service';
import { ContactsService } from 'src/contacts/contacts.service';
import { MessagesApiService } from 'src/messages-api/messages-api.service';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { CredentialsService } from 'src/credentials/credentials.service';
import { DocumentLoaderService } from 'src/documentLoader/documentLoader.service';
import { DIDKeyService } from 'src/didkey/didkey.service';
import { DIDCommModule } from 'src/didcomm/didcomm.module';

@Module({
  imports: [DIDCommModule],
  controllers: [PresentationsController],
  providers: [
    PresentationsService,
    DBService,
    Logger,
    ConfigService,
    DIDWebService,
    DIDKeyService,
    KMSService,
    DIDResolverService,
    ContactsService,
    MessagesApiService,
    DocumentLoaderService,
    EventBus,
    CommandBus,
    CredentialsService,
    DocumentLoaderService,
  ],
})
export class PresentationsModule {}
