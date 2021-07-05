import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DBService } from './db/db.service';
import { DIDCommService } from './didcomm/didcomm.service';
import { DIDResolverService } from './dids/didresolver.service';
import { DIDWebService } from './didweb/didweb.service';
import { DocumentLoaderService } from './documentLoader/documentLoader.service';

@Module({
  imports: [ConfigModule.forRoot(), InMemoryDBModule.forRoot({})],
  controllers: [AppController],
  providers: [
    AppService,
    DIDWebService,
    DBService,
    DIDCommService,
    DIDResolverService,
    DocumentLoaderService,
  ],
})
export class AppModule {}
