import { IJWE } from '@aviarytech/crypto-core';
import { IDIDCommPayload } from '@aviarytech/didcomm-core/dist/interfaces';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FastifyRequest } from 'fastify';
import { ReceiveMessageCommand } from './didcomm/commands/receive-message.command';
import { DIDCommService } from './didcomm/didcomm.service';

import { DIDResolverService } from './dids/didresolver.service';
import { DIDWebService } from './didweb/didweb.service';
import { SendDIDCommMessageSchema } from './requestSchemas/SendDIDCommMessageSchema';

@Controller()
export class AppController {
  constructor(
    private readonly didWebService: DIDWebService,
    private readonly DIDComm: DIDCommService,
    private readonly didResolver: DIDResolverService,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('.well-known/did.json')
  async getWebDIDs(): Promise<string> {
    return JSON.stringify(await this.didWebService.getWebDIDDoc());
  }

  @Post('didcomm')
  async ReceiveDIDCommMessage(
    @Req() req: FastifyRequest<{ Body: IJWE }>,
  ): Promise<string> {
    const received = await this.DIDComm.receiveMessage(req.body);
    // console.log('Received', req.body);
    // this.commandBus.execute(
    //   new ReceiveMessageCommand(req.headers['content-type'], req.body),
    // );
    if (!received) {
      throw new HttpException('Failed to receive message', 400);
    }
    return 'OK';
  }

  @Post('didcomm/send')
  async SendDIDCommMessage(
    @Body() body: SendDIDCommMessageSchema,
  ): Promise<string> {
    try {
      const sent = await this.DIDComm.sendMessage({
        payload: body,
        repudiable: false,
      });
      if (sent) {
        return 'Message successfully sent';
      }
      throw new HttpException('Message failed to send', HttpStatus.BAD_REQUEST);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
