import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DBService } from 'src/db/db.service';
import { generateEd25519 } from 'src/kms/ed25519';
import { generateX25519 } from 'src/kms/x25519';
import { generateBls12381G1, generateBls12381G2 } from 'src/kms/bls12381';
import { IDIDDocument } from '@aviarytech/did-core';
import { KeyEntity } from 'src/db/entities/key';
import { JsonWebKey } from '@transmute/json-web-signature';
import { X25519KeyPair } from '@transmute/x25519-key-pair';
import { JsonWebKey2020 } from '@transmute/web-crypto-key-pair';
import { randomBytes } from 'crypto';
import { encode } from 'b58';

@Injectable()
export class DIDWebService {
  keys: KeyEntity[];
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

  get serviceProtocol(): string {
    return this.configService.get('HOST').indexOf('localhost') >= 0
      ? 'http'
      : 'https';
  }

  async getKeys() {
    const key0 = await this.getKey0();
    const key1 = await this.getKey1();
    // const keyG1 = await this.getKeyG1();
    // const keyG2 = await this.getKeyG2();
    this.keys = [key0, key1];
  }

  async getKey0(): Promise<KeyEntity> {
    let key0 = this.dbService.getKey(`${this.did}#key-0`);
    if (!key0) {
      const keyPair = await JsonWebKey.generate({
        kty: 'OKP',
        crv: 'Ed25519',
      });
      const { publicKeyJwk, privateKeyJwk } = await keyPair.export({
        type: 'JsonWebKey2020',
      });
      key0 = this.dbService.createKey({
        id: `${this.did}#key-0`,
        controller: this.did,
        type: 'JsonWebKey2020',
        publicKeyJwk: publicKeyJwk,
        privateKeyJwk: privateKeyJwk,
      });
    }
    return key0 as KeyEntity;
  }

  async getKey1(): Promise<KeyEntity> {
    let key1 = this.dbService.getKey(`${this.did}#key-1`);
    if (!key1) {
      const keyPair = await X25519KeyPair.generate({
        secureRandom: () => {
          return randomBytes(32);
        },
      });

      key1 = this.dbService.createKey({
        id: `${this.did}#key-1`,
        type: 'X25519KeyAgreementKey2019',
        controller: this.did,
        publicKeyBase58: encode(keyPair.publicKey),
        privateKeyBase58: encode(keyPair.privateKey),
      });
    }
    return key1 as KeyEntity;
  }

  async getKeyG1(): Promise<KeyEntity> {
    let keyg1 = this.dbService.getKey(`${this.did}#key-g1`);
    if (!keyg1) {
      const keyPair = await JsonWebKey.generate({
        kty: 'EC',
        crv: 'BLS12381_G1',
      });
      keyg1 = this.dbService.createKey({
        ...keyPair,
        id: `${this.did}#key-g1`,
      });
    }
    return keyg1 as KeyEntity;
  }

  async getKeyG2(): Promise<KeyEntity> {
    let keyg2 = this.dbService.getKey(`${this.did}#key-g2`);
    if (!keyg2) {
      const keyPair = await JsonWebKey.generate({
        kty: 'EC',
        crv: 'BLS12381_G2',
      });
      keyg2 = this.dbService.createKey({
        ...keyPair,
        id: `${this.did}#key-g2`,
      });
    }
    return keyg2 as KeyEntity;
  }

  async getWebDIDDoc(): Promise<IDIDDocument> {
    const keys = this.dbService.getAllKeys();
    return {
      '@context': [
        'https://www.w3.org/ns/did/v1',
        'https://w3id.org/security/suites/jws-2020/v1',
      ],
      id: this.did,
      verificationMethod: keys.map((key) => {
        const resp = { id: key.id, controller: this.did, type: key.type };
        return key.type === 'JsonWebKey2020'
          ? {
              ...resp,
              publicKeyJwk: key.publicKeyJwk,
            }
          : {
              ...resp,
              publicKeyBase58: key.publicKeyBase58,
            };
      }),
      authentication: [this.keys[0].id],
      assertionMethod: [this.keys[0].id],
      keyAgreement: [this.keys[1].id],
      service: [
        {
          id: `${this.did}#didcomm`,
          type: 'DIDCommMessaging',
          serviceEndpoint: `${this.serviceProtocol}://${this.configService.get(
            'HOST',
          )}/didcomm`,
          routingKeys: [this.keys[1].id],
        },
      ],
    };
  }
}
