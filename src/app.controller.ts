import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { decodeJWT, JWE, verifyJWT } from 'did-jwt';
import { FastifyRequest } from 'fastify';
import { AppService } from './app.service';
import { DIDCommService } from './didcomm/didcomm.service';
import { DIDResolverService } from './dids/didresolver.service';
import { DIDWebService } from './didweb/didweb.service';
import { IDIDCommEncryptedMessage } from './interfaces/IDIDCommEncryptedMessage';
import {
  IDIDCommPlaintextMessage,
  IDIDCommPlaintextPayload,
} from './interfaces/IDIDCommPlaintextMessage';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly didWebService: DIDWebService,
    private readonly DIDComm: DIDCommService,
    private readonly didResolver: DIDResolverService,
  ) {}

  @Get('.well-known/did.json')
  getWebDIDs(): string {
    return JSON.stringify(this.didWebService.getWebDIDDoc());
  }

  @Post('didcomm')
  async ReceiveDIDCommMessage(
    @Req() req: FastifyRequest<{ Body: IDIDCommEncryptedMessage }>,
  ): Promise<IDIDCommPlaintextMessage> {
    const message = await this.DIDComm.unpackMessage({
      mediaType: req.headers['content-type'],
      ...req.body,
    });
    return message;
  }

  @Post('didcomm/send')
  async SendDIDCommMessage(
    @Req() req: FastifyRequest<{ Body: IDIDCommPlaintextPayload }>,
  ): Promise<string> {
    try {
      const didDoc = await this.didResolver.resolve(req.body.to);
      const res = await this.DIDComm.createMessage(didDoc, req.body);
      const sent = await this.DIDComm.sendMessage(didDoc, res);
      if (sent) {
        return 'Message successfully sent';
      }
      throw new HttpException('Message failed to send', HttpStatus.BAD_REQUEST);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
