import { IJWE } from '@aviarytech/crypto-core';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SendTrustPingCommand } from './didcomm/commands/send-trust-ping.command';

import { DIDResolverService } from './dids/didresolver.service';
import { DIDWebService } from './didweb/didweb.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('didcoms')
@Controller()
export class AppController {
  constructor(
    private readonly didWebService: DIDWebService,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('.well-known/did.json')
  async getWebDIDs(): Promise<string> {
    return JSON.stringify(await this.didWebService.getWebDIDDoc());
  }

  @Post('ping/:did')
  async TrustPing(@Param() params: { did: string }): Promise<string> {
    try {
      const sent = await this.commandBus.execute(
        new SendTrustPingCommand(params.did),
      );
      if (sent) {
        return 'Message successfully sent';
      }
      throw new HttpException('Message failed to send', HttpStatus.BAD_REQUEST);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
