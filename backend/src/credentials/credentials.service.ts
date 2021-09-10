import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DBService } from 'src/db/db.service';
@Injectable()
export class CredentialsService implements OnApplicationBootstrap {
  constructor(private db: DBService) {}

  async onApplicationBootstrap(): Promise<void> {
    setTimeout(async () => {
      this.reset();
    }, 500);
  }

  async reset() {
    const vc1 = require('../../__fixtures__/vc-1.json');
    if (!(await this.db.getById(vc1.id))) {
      await this.create(vc1);
      console.log(`created ${vc1.id} credential`);
    }
  }

  async create(credential: Credential): Promise<Credential> {
    return await this.db.create({
      '@type': 'Credential',
      '@id': credential.id,
      id: credential.id,
      data: credential,
    });
  }

  async findAll(): Promise<Credential[]> {
    return await this.db.getAllByType('Credential');
  }

  async findOne(id: string): Promise<Credential> {
    return await this.db.getById(id);
  }
}
