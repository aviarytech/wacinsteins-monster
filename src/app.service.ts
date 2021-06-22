import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWebDIDDoc(): string {
    return 'Hello World!';
  }
}
