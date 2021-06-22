import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DBService } from './db/db.service';
import { DIDWebService } from './didweb/didweb.service';

@Module({
  imports: [ConfigModule.forRoot(), InMemoryDBModule.forRoot({})],

  controllers: [AppController],
  providers: [AppService, DIDWebService, DBService],
})
export class AppModule {}
