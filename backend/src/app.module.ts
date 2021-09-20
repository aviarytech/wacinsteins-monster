import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AdminController } from './admin/admin.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DBService } from './db/db.service';
import { CommandHandlers } from './didcomm/commands';
import { EventHandlers } from './didcomm/events';
import { DIDCommModule } from './didcomm/didcomm.module';
import { DIDResolverService } from './dids/didresolver.service';
import { DIDWebService } from './didweb/didweb.service';
import { DocumentLoaderService } from './documentLoader/documentLoader.service';
import { KMSModule } from './kms/kms.module';
import { KMSService } from './kms/kms.service';
import { PresentationsModule } from './presentations/presentations.module';
import { CredentialsModule } from './credentials/credentials.module';
import { ContactsModule } from './contacts/contacts.module';
import { MessagesApiModule } from './messages-api/messages-api.module';
import { MsgGatewayModule } from './messages-api-websocket/msg.module';
import { CredentialsService } from './credentials/credentials.service';
import { DIDKeyService } from './didkey/didkey.service';
import { VerifierService } from './verifier/verifier.service';
import { VerifierController } from './verifier/verifier.controller';
import { VerifierModule } from './verifier/verifier.module';
import { DIDCommService } from './didcomm/didcomm.service';
import { PresentationsService } from './presentations/presentations.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CqrsModule,
    PresentationsModule,
    KMSModule,
    CredentialsModule,
    ContactsModule,
    MessagesApiModule,
    DIDCommModule,
    MsgGatewayModule,
    VerifierModule,
  ],
  controllers: [AppController, AdminController],
  providers: [
    AppService,
    DIDWebService,
    DIDKeyService,
    DBService,
    Logger,
    DIDResolverService,
    DocumentLoaderService,
    KMSService,
    ...CommandHandlers,
    ...EventHandlers,
    CredentialsService,
    VerifierService,
  ],
})
export class AppModule {}
