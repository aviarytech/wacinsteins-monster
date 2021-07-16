import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
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

@Module({
  imports: [ConfigModule.forRoot(), InMemoryDBModule.forRoot({}), CqrsModule],
  controllers: [AppController],
  providers: [
    AppService,
    DIDWebService,
    DBService,
    DIDCommService,
    DIDResolverService,
    DocumentLoaderService,
    ...CommandHandlers,
    ...EventHandlers,
    HandleMessageSaga,
  ],
})
export class AppModule {}
