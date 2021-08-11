import { Logger, Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CredentialsController } from './credentials.controller';
import { DBService } from 'src/db/db.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [CredentialsController],
  providers: [CredentialsService, DBService, Logger, ConfigService],
})
export class CredentialsModule {}
