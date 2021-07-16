import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { Injectable } from '@nestjs/common';

import { KeyEntity } from './entities/key';

@Injectable()
export class DBService {
  constructor(private readonly keyService: InMemoryDBService<KeyEntity>) {}

  createKey(key: KeyEntity) {
    return this.keyService.create(key);
  }

  getKey(id: string): KeyEntity {
    return this.keyService.get(id);
  }

  getAllKeys(): KeyEntity[] {
    return this.keyService.getAll();
  }
}
