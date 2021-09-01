import { Logger, Module } from '@nestjs/common';
import { MessagesApiService } from './messages-api.service';
import { MessagesApiController } from './messages-api.controller';
import { DBService } from 'src/db/db.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [MessagesApiController],
  providers: [MessagesApiService,DBService,Logger,ConfigService]
})
export class MessagesApiModule {}
