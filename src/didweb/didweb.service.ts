import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DBService } from 'src/db/db.service';
import { JSONWebKeyEntity } from 'src/db/entities/key';
import IDIDDocument from 'src/interfaces/IDIDDocument';
import { generateEd25519 } from 'src/kms/ed25519';
import { generateX25519 } from 'src/kms/x25519';
import { generateBls12381G1, generateBls12381G2 } from 'src/kms/bls12381';

@Injectable()
export class DIDWebService {
  keys: JSONWebKeyEntity[];
  did: string;

  constructor(
    private dbService: DBService,
    private configService: ConfigService,
  ) {
    this.getKeys();
    if (!this.configService.get('HOST')) {
      throw Error('HOST env var must be set');
    }
    this.did = `did:web:${this.configService.get('HOST')}`;
  }

  async getKeys() {
    const key0 = await this.getKey0();
    const key1 = await this.getKey1();
    const keyG1 = await this.getKeyG1();
    const keyG2 = await this.getKeyG2();
    this.keys = [key0, key1, keyG1, keyG2];
  }

  async getKey0(): Promise<JSONWebKeyEntity> {
    let key0 = this.dbService.getKey(`${this.did}#key-0`);
    if (!key0) {
      const keyPair = await generateEd25519();
      key0 = this.dbService.createKey({
        id: `${this.did}#key-0`,
        ...keyPair.publicKeyJwk,
        ...keyPair.privateKeyJwk,
      });
    }
    return key0;
  }

  async getKey1(): Promise<JSONWebKeyEntity> {
    let key1 = this.dbService.getKey(`${this.did}#key-1`);
    if (!key1) {
      const keyPair = await generateX25519();
      key1 = this.dbService.createKey({
        id: `${this.did}#key-1`,
        ...keyPair.publicKeyJwk,
        ...keyPair.privateKeyJwk,
      });
    }
    return key1;
  }

  async getKeyG1(): Promise<JSONWebKeyEntity> {
    let keyg1 = this.dbService.getKey(`${this.did}#key-g1`);
    if (!keyg1) {
      const keyPair = await generateBls12381G1();
      keyg1 = this.dbService.createKey({
        id: `${this.did}#key-g1`,
        ...keyPair.publicKeyJwk,
        ...keyPair.privateKeyJwk,
      });
    }
    return keyg1;
  }

  async getKeyG2(): Promise<JSONWebKeyEntity> {
    let keyg2 = this.dbService.getKey(`${this.did}#key-g2`);
    if (!keyg2) {
      const keyPair = await generateBls12381G2();
      keyg2 = this.dbService.createKey({
        id: `${this.did}#key-g2`,
        ...keyPair.publicKeyJwk,
        ...keyPair.privateKeyJwk,
      });
    }
    return keyg2;
  }

  getWebDIDDoc(): IDIDDocument {
    const keys = this.dbService.getAllKeys();
    return {
      '@context': [
        'https://www.w3.org/ns/did/v1',
        'https://w3id.org/security/suites/jws-2020/v1',
      ],
      id: this.did,
      verificationMethod: keys.map((key) => {
        return {
          id: key.id,
          controller: this.did,
          type: 'JsonWebKey2020',
          publicKeyJwk: {
            kty: key.kty,
            crv: key.crv,
            x: key.x,
          },
        };
      }),
      authentication: [this.keys[0].id],
      assertionMethod: [this.keys[0].id, this.keys[3].id],
      keyAgreement: [this.keys[1].id],
      service: [
        {
          id: `${this.did}#didcomm`,
          type: 'DIDCommMessaging',
          serviceEndpoint: `https://${this.configService.get('HOST')}/didcomm`,
          routingKeys: [this.keys[1].id],
        },
      ],
    };
  }
}
