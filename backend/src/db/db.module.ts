import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DBService } from './db.service';

@Module({
  providers: [DBService, Logger, ConfigService],
  exports: [DBService],
})
export class DatabaseModule {}
