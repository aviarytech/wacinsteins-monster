import { Controller, Get, Post } from '@nestjs/common';
import { CredentialsService } from 'src/credentials/credentials.service';
import { DBService } from 'src/db/db.service';
import { DIDWebService } from 'src/didweb/didweb.service';

@Controller('/admin')
export class AdminController {
  constructor(
    private db: DBService,
    private didweb: DIDWebService,
    private credentials: CredentialsService,
  ) {}

  @Post('/drop-db')
  async dropDatabase() {
    await this.db.drop();
    await this.didweb.reset();
    await this.credentials.reset();
  }

  @Get('/events')
  async getEvents() {
    return this.db.getEventsDoc();
  }
}
