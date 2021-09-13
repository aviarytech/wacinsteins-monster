import { Logger, Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CredentialsController } from './credentials.controller';
import { DBService } from 'src/db/db.service';
import { ConfigService } from '@nestjs/config';
import { DocumentLoaderService } from '../documentLoader/documentLoader.service';
import { DIDWebService } from '../didweb/didweb.service';
import { KMSModule } from 'src/kms/kms.module';
import { DIDKeyService } from 'src/didkey/didkey.service';

@Module({
  controllers: [CredentialsController],
  imports: [KMSModule],
  providers: [
    CredentialsService,
    DBService,
    Logger,
    ConfigService,
    DocumentLoaderService,
    DIDWebService,
    DIDKeyService,
  ],
})
export class CredentialsModule {}
