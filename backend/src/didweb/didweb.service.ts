import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DIDDocument, IDIDDocument } from '@aviarytech/did-core';
import { JsonWebKey } from '@aviarytech/crypto-core';
import { Key } from '../kms/entities/key';
import { randomBytes } from 'crypto';
import { encode } from 'b58';
import { KMSService } from '../kms/kms.service';
import { DBService } from '../db/db.service';
import { generateX25519 } from '../kms/x25519';
import axios from 'axios';
import { generateEd25519 } from 'src/kms/ed25519';

@Injectable()
export class DIDWebService {
  keys: Key[];
  did: string;
  basePath: string;

  constructor(
    private kms: KMSService,
    private configService: ConfigService,
    private db: DBService,
  ) {
    if (!this.configService.get('HOST')) {
      throw Error('HOST env var must be set');
    }
    this.did = `did:web:${this.configService.get('HOST')}`;
    this.reset();
    const protocol =
      this.configService.get('HOST').indexOf('localhost') >= 0
        ? 'http'
        : 'https';
    this.basePath = `${protocol}://${this.configService.get('HOST')}`;
  }

  async reset() {
    await this.db.ready;
    const key0 = await this.getKey0();
    const key1 = await this.getKey1();
    // const keyG1 = await this.getKeyG1();
    // const keyG2 = await this.getKeyG2();
    this.keys = [key0, key1];
  }

  async getAuthenticationKey() {
    return this.getKey0();
  }

  async getKey0(): Promise<Key> {
    let key0 = await this.kms.getKey(`${this.did}#key-0`);
    if (!key0) {
      const keyPair = await generateEd25519();
      const { publicKeyJwk, privateKeyJwk } = (await keyPair.export({
        type: 'JsonWebKey2020',
        privateKey: true,
      })) as JsonWebKey;
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
      const keyPair = await generateX25519();

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

  async getWebDIDDoc(): Promise<object> {
    const keys = await this.kms.getAllKeys();

    const didDoc = new DIDDocument({
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
      authentication: [keys[0].id],
      assertionMethod: [keys[0].id],
      keyAgreement: [keys[1].id],
      service: [
        {
          id: `${this.did}#didcomm`,
          type: 'DIDCommMessaging',
          serviceEndpoint: `${this.basePath}/didcomm`,
          routingKeys: [keys[1].id],
        },
      ],
    });
    return didDoc.document;
  }

  async resolve(iri: string) {
    const [did, path] = iri.split('#');
    let [_, method, domain, ...extras] = did.split(':');
    if (domain.indexOf('localhost') >= 0) {
      domain += `:${extras}`;
    }
    const protocol = did.indexOf('localhost') >= 0 ? 'http' : 'https';
    const resp = await axios.get(
      `${protocol}://${domain}/.well-known/did.json`,
    );
    return resp.data;
  }
}
