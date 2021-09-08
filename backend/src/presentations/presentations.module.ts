import { Logger, Module } from '@nestjs/common';
import { PresentationsService } from './presentations.service';
import { PresentationsController } from './presentations.controller';
import { DBService } from 'src/db/db.service';
import { ConfigService } from '@nestjs/config';
import { DIDWebService } from 'src/didweb/didweb.service';
import { KMSService } from 'src/kms/kms.service';

@Module({
  controllers: [PresentationsController],
  providers: [
    PresentationsService,
    DBService,
    Logger,
    ConfigService,
    DIDWebService,
    KMSService,
  ],
})
export class PresentationsModule {}
