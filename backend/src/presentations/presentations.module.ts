import { Logger, Module } from '@nestjs/common';
import { PresentationsService } from './presentations.service';
import { PresentationsController } from './presentations.controller';
import { DBService } from 'src/db/db.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [PresentationsController],
  providers: [PresentationsService, DBService, Logger, ConfigService],
})
export class PresentationsModule {}
