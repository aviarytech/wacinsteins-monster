import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import {
  BbsBlsSignatureProof2020,
  deriveProof,
} from '@mattrglobal/jsonld-signatures-bbs';
import { DBService } from '../db/db.service';
import { Credential, VerifiableCredential } from './interfaces';
import { DocumentLoaderService } from 'src/documentLoader/documentLoader.service';
@Injectable()
export class CredentialsService implements OnApplicationBootstrap {
  constructor(
    private db: DBService,
    private documentLoader: DocumentLoaderService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    setTimeout(async () => {
      this.reset();
    }, 500);
  }

  async reset() {
    await this.db.ready;
    const vc1 = require('../../__fixtures__/vc-1.json');
    if (!(await this.db.getById(vc1.id))) {
      await this.create(vc1);
      console.log(`created ${vc1.id} credential`);
    }
  }

  async create(credential: VerifiableCredential): Promise<Credential> {
    return await this.db.create({
      '@type': 'Credential',
      id: credential.id,
      verifiableCredential: credential,
      derivedCredentials: [],
    });
  }

  async findAll(): Promise<Credential[]> {
    return await this.db.getAllByType('Credential');
  }

  async findOne(id: string): Promise<Credential> {
    return await this.db.getById(id);
  }

  async update(credential: Credential) {
    return await this.db.upsert(credential);
  }

  async deriveCredential(
    verifiableCredential: VerifiableCredential,
    frame: object,
  ): Promise<VerifiableCredential> {
    const derived = await deriveProof(verifiableCredential, frame, {
      documentLoader: this.documentLoader.loader,
      suite: new BbsBlsSignatureProof2020(),
    });
    const cred = await this.findOne(verifiableCredential.id);
    await this.update({
      ...cred,
      derivedCredentials: [...cred.derivedCredentials, derived],
    });
    return derived;
  }
}
