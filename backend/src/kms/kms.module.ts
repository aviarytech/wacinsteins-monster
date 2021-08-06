import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DBService } from '../db/db.service';
import { KMSService } from './kms.service';

@Module({
  providers: [KMSService, DBService, Logger, ConfigService],
  exports: [KMSService],
})
export class KMSModule {}
