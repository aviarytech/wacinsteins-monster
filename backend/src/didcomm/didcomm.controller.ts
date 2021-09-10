import { IJWE } from '@aviarytech/crypto-core';
import { BasicMessage } from '@aviarytech/didcomm-protocols.basic-message';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { DIDWebService } from '../didweb/didweb.service';
import { SendDIDCommMessageSchema } from '../requestSchemas/SendDIDCommMessageSchema';
import { DIDCommService } from './didcomm.service';

@Controller('didcomm')
export class DIDCommController {
  constructor(
    private readonly DIDComm: DIDCommService,
    private readonly didWeb: DIDWebService,
  ) { }

  @Post('/')
  async ReceiveDIDCommMessage(
    @Req() req: FastifyRequest<{ Body: IJWE }>,
  ): Promise<string> {
    const received = await this.DIDComm.receiveMessage(req.body);
    if (!received) {
      throw new HttpException('Failed to receive message', 400);
    }
    return 'OK';
  }

  @Post('send/:did')
  async SendDIDCommMessage(
    @Body() body: SendDIDCommMessageSchema,
    @Param() params: { did: string },
  ): Promise<string> {
    try {
      const sent = await this.DIDComm.sendMessage(
        params.did,
        new BasicMessage(this.didWeb.did, [params.did], body.body),
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
