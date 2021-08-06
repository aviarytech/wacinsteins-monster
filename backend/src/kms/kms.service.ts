import { Injectable } from '@nestjs/common';
import { sha256 } from '../utils/sha256';
import { DBService } from '../db/db.service';
import { Key } from './entities/key';

@Injectable()
export class KMSService {
  constructor(private readonly dbService: DBService) {}

  async createKey(key: Key) {
    console.log(key);
    return await this.dbService.create({
      '@type': 'Key',
      '@id': sha256(key.id),
      ...key,
    });
  }

  async getKey(id: string): Promise<Key> {
    const key = await this.dbService.getById(sha256(id));
    return key;
  }

  async getAllKeys(): Promise<Key[]> {
    return await this.dbService.getAllByType('Key');
  }
}
