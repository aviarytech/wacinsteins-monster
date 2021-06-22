import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { Injectable } from '@nestjs/common';

import { JSONWebKeyEntity } from './entities/key';

@Injectable()
export class DBService {
  constructor(
    private readonly keyService: InMemoryDBService<JSONWebKeyEntity>,
  ) {}

  createKey(key: JSONWebKeyEntity) {
    return this.keyService.create(key);
  }

  getKey(id: string): JSONWebKeyEntity {
    return this.keyService.get(id);
  }

  getAllKeys(): JSONWebKeyEntity[] {
    return this.keyService.getAll();
  }
}
