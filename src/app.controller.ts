import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DIDWebService } from './didweb/didweb.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly didWebService: DIDWebService,
  ) {}

  @Get('.well-known/did.json')
  getWebDIDs(): string {
    return JSON.stringify(this.didWebService.getWebDIDDoc());
  }
}
