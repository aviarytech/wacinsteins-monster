import { Controller, Get, Post } from '@nestjs/common';
import { DBService } from 'src/db/db.service';

@Controller('/admin')
export class AdminController {
  constructor(private db: DBService) {}

  @Post('/drop-db')
  async dropDatabase() {
    await this.db.drop();
  }

  @Get('/events')
  async getEvents() {
    return this.db.getEventsDoc();
  }
}
