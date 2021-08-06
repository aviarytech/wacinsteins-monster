import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDIDDocument } from '@aviarytech/did-core';
import { Key } from '../kms/entities/key';
import { JsonWebKey } from '@transmute/json-web-signature';
import { X25519KeyPair } from '@transmute/x25519-key-pair';
import { randomBytes } from 'crypto';
import { encode } from 'b58';
import { KMSService } from '../kms/kms.service';
import { DBService } from 'src/db/db.service';

@Injectable()
export class DIDWebService {
  keys: Key[];
  did: string;

  constructor(
    private kms: KMSService,
    private configService: ConfigService,
    private db: DBService,
  ) {
    if (!this.configService.get('HOST')) {
      throw Error('HOST env var must be set');
    }
    this.did = `did:web:${this.configService.get('HOST')}`;
    this.getKeys();
  }

  get serviceProtocol(): string {
    return this.configService.get('HOST').indexOf('localhost') >= 0
      ? 'http'
      : 'https';
  }

  async getKeys() {
    await this.db.ready;
    const key0 = await this.getKey0();
    const key1 = await this.getKey1();
    // const keyG1 = await this.getKeyG1();
    // const keyG2 = await this.getKeyG2();
    this.keys = [key0, key1];
  }

  async getKey0(): Promise<Key> {
    let key0 = await this.kms.getKey(`${this.did}#key-0`);
    if (!key0) {
      const keyPair = await JsonWebKey.generate({
        kty: 'OKP',
        crv: 'Ed25519',
      });
      const { publicKeyJwk, privateKeyJwk } = await keyPair.export({
        type: 'JsonWebKey2020',
        privateKey: true,
      });
      key0 = await this.kms.createKey({
        id: `${this.did}#key-0`,
        controller: this.did,
        type: 'JsonWebKey2020',
        publicKeyJwk: publicKeyJwk,
        privateKeyJwk: privateKeyJwk,
      });
    }
    return key0 as Key;
  }

  async getKey1(): Promise<Key> {
    let key1 = await this.kms.getKey(`${this.did}#key-1`);
    if (!key1) {
      const keyPair = await X25519KeyPair.generate({
        secureRandom: () => {
          return randomBytes(32);
        },
      });

      key1 = await this.kms.createKey({
        id: `${this.did}#key-1`,
        type: 'X25519KeyAgreementKey2019',
        controller: this.did,
        publicKeyBase58: encode(keyPair.publicKey),
        privateKeyBase58: encode(keyPair.privateKey),
      });
    }
    return key1 as Key;
  }

  async getKeyG1(): Promise<Key> {
    let keyg1 = await this.kms.getKey(`${this.did}#key-g1`);
    if (!keyg1) {
      const keyPair = await JsonWebKey.generate({
        kty: 'EC',
        crv: 'BLS12381_G1',
      });
      keyg1 = await this.kms.createKey({
        ...keyPair,
        id: `${this.did}#key-g1`,
      });
    }
    return keyg1 as Key;
  }

  async getKeyG2(): Promise<Key> {
    let keyg2 = await this.kms.getKey(`${this.did}#key-g2`);
    if (!keyg2) {
      const keyPair = await JsonWebKey.generate({
        kty: 'EC',
        crv: 'BLS12381_G2',
      });
      keyg2 = await this.kms.createKey({
        ...keyPair,
        id: `${this.did}#key-g2`,
      });
    }
    return keyg2 as Key;
  }

  async getWebDIDDoc(): Promise<IDIDDocument> {
    const keys = await this.kms.getAllKeys();
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