import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DBService } from 'src/db/db.service';
import { DIDKeyService } from 'src/didkey/didkey.service';
import { DIDWebService } from 'src/didweb/didweb.service';
import { DocumentLoaderService } from 'src/documentLoader/documentLoader.service';
import { KMSService } from 'src/kms/kms.service';
import { VerifierController } from './verifier.controller';
import { VerifierService } from './verifier.service';

@Module({
  imports: [],
  controllers: [VerifierController],
  providers: [
    DocumentLoaderService,
    VerifierService,
    DIDWebService,
    DIDKeyService,
    KMSService,
    ConfigService,
    DBService,
    Logger,
  ],
})
export class VerifierModule {}
