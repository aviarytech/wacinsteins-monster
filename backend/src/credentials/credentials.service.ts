import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import {
  BbsBlsSignatureProof2020,
  deriveProof,
} from '@mattrglobal/jsonld-signatures-bbs';
import { DBService } from '../db/db.service';
import { Credential, VerifiableCredential } from './interfaces';
import { DocumentLoaderService } from 'src/documentLoader/documentLoader.service';
import { sha256 } from '@aviarytech/crypto-core';
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
    const id1 = sha256('vc-1.json');
    if (!(await this.db.getById(id1))) {
      await this.create(id1, vc1);
      console.log(`created ${id1} credential`);
    }

    const case16 = require('../../__fixtures__/case-16.json');
    const id2 = sha256('case-16.json');
    if (!(await this.db.getById(id2))) {
      await this.create(id2, case16);
      console.log(`created ${id2} credential`);
    }
    const case18 = require('../../__fixtures__/case-18.json');
    const id4 = sha256('case-18.json');
    if (!(await this.db.getById(id4))) {
      await this.create(id4, case18);
      console.log(`created ${id4} credential`);
    }
    const case20 = require('../../__fixtures__/case-20.json');
    const id6 = sha256('case-20.json');
    if (!(await this.db.getById(id6))) {
      await this.create(id6, case20);
      console.log(`created ${id6} credential`);
    }
  }

  async create(
    id: string,
    credential: VerifiableCredential,
  ): Promise<Credential> {
    return await this.db.create({
      '@type': 'Credential',
      id,
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
    credentialId: string,
    verifiableCredential: VerifiableCredential,
    frame: object,
  ): Promise<VerifiableCredential> {
    const derived = await deriveProof(verifiableCredential, frame, {
      documentLoader: this.documentLoader.loader,
      suite: new BbsBlsSignatureProof2020(),
    });
    const cred = await this.findOne(credentialId);
    await this.update({
      ...cred,
      derivedCredentials: [...cred.derivedCredentials, derived],
    });
    return derived;
  }
}
