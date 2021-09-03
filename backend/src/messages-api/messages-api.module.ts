import { Logger, Module } from '@nestjs/common';
import { MessagesApiService } from './messages-api.service';
import { MessagesApiController } from './messages-api.controller';
import { DBService } from 'src/db/db.service';
import { ConfigService } from '@nestjs/config';
import { DIDWebService } from 'src/didweb/didweb.service';
import { KMSService } from 'src/kms/kms.service';
import { DIDCommModule } from 'src/didcomm/didcomm.module';
import { CqrsModule } from '@nestjs/cqrs';
import { EventHandlers } from './events';

@Module({
  imports: [DIDCommModule, CqrsModule],
  controllers: [MessagesApiController],
  providers: [
    MessagesApiService,
    DBService,
    Logger,
    ConfigService,
    DIDWebService,
    KMSService,
    ...EventHandlers,
  ],
})
export class MessagesApiModule {}
