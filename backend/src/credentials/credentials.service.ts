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
    const case17 = require('../../__fixtures__/case-17.json');
    const id3 = sha256('case-17.json');
    if (!(await this.db.getById(id3))) {
      await this.create(id3, case17);
      console.log(`created ${id3} credential`);
    }
    const case18 = require('../../__fixtures__/case-18.json');
    const id4 = sha256('case-18.json');
    if (!(await this.db.getById(id4))) {
      await this.create(id4, case18);
      console.log(`created ${id4} credential`);
    }
    const case19 = require('../../__fixtures__/case-19.json');
    const id5 = sha256('case-19.json');
    if (!(await this.db.getById(id5))) {
      await this.create(id5, case19);
      console.log(`created ${id5} credential`);
    }
    const case20 = require('../../__fixtures__/case-20.json');
    const id6 = sha256('case-20.json');
    if (!(await this.db.getById(id6))) {
      await this.create(id6, case20);
      console.log(`created ${id6} credential`);
    }
    const case21 = require('../../__fixtures__/case-21.json');
    const id7 = sha256('case-21.json');
    if (!(await this.db.getById(id7))) {
      await this.create(id7, case21);
      console.log(`created ${id7} credential`);
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
