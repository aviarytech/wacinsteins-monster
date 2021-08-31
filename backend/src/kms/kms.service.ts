import { ISecret, Secret } from '@aviarytech/did-secrets';
import { Injectable } from '@nestjs/common';
import { sha256 } from '../utils/sha256';
import { DBService } from '../db/db.service';
import { Key } from './entities/key';

@Injectable()
export class KMSService {
  constructor(private readonly dbService: DBService) {}

  async createKey(key: Key) {
    return await this.dbService.create({
      '@type': 'Key',
      '@id': sha256(key.id),
      ...key,
    });
  }

  async getKey(id: string): Promise<Key> {
    return await this.dbService.getById(sha256(id));
  }

  async getAllKeys(): Promise<Key[]> {
    return await this.dbService.getAllByType('Key');
  }

  async resolve(id: string): Promise<ISecret> {
    const key = await this.getKey(id);
    return new Secret(key);
  }
}
