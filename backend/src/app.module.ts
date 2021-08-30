import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AdminController } from './admin/admin.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DBService } from './db/db.service';
import { CommandHandlers } from './didcomm/commands';
import { DIDCommService } from './didcomm/didcomm.service';
import { EventHandlers } from './didcomm/events';
import { HandleMessageSaga } from './didcomm/handle-message.saga';
import { DIDResolverService } from './dids/didresolver.service';
import { DIDWebService } from './didweb/didweb.service';
import { DocumentLoaderService } from './documentLoader/documentLoader.service';
import { KMSModule } from './kms/kms.module';
import { KMSService } from './kms/kms.service';
import { PresentationsModule } from './presentations/presentations.module';
import { CredentialsModule } from './credentials/credentials.module';
import { ContactsModule } from './contacts/contacts.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CqrsModule,
    PresentationsModule,
    KMSModule,
    CredentialsModule,
    ContactsModule,
  ],
  controllers: [AppController, AdminController],
  providers: [
    AppService,
    DIDWebService,
    DBService,
    DIDCommService,
    Logger,
    DIDResolverService,
    DocumentLoaderService,
    KMSService,
    ...CommandHandlers,
    ...EventHandlers,
    HandleMessageSaga,
  ],
})
export class AppModule {}
