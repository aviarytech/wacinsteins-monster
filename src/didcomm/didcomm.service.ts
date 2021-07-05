import { Injectable, NotImplementedException } from '@nestjs/common';
import { createAnonEncrypter, decryptJWE } from 'did-jwt';
import { DIDResolverService } from 'src/dids/didresolver.service';
import {
  DIDCommMessageMediaType,
  IBaseDIDCommMessage,
} from 'src/interfaces/IBaseDIDCommMessage';

import { IDIDCommEncryptedMessage } from 'src/interfaces/IDIDCommEncryptedMessage';
import {
  IDIDCommPlaintextMessage,
  IDIDCommPlaintextPayload,
} from 'src/interfaces/IDIDCommPlaintextMessage';
import { FlattenedEncrypt, FlattenedJWE } from 'jose/jwe/flattened/encrypt';
import { JWK, parseJwk } from 'jose/jwk/parse';
import { flattenedDecrypt } from 'jose/jwe/flattened/decrypt';
import { DBService } from 'src/db/db.service';
import IDIDDocument from 'src/interfaces/IDIDDocument';
import axios from 'axios';

@Injectable()
export class DIDCommService {
  constructor(private didResolver: DIDResolverService, private db: DBService) {}

  async createMessage(
    didDoc: IDIDDocument,
    msg: IDIDCommPlaintextPayload,
  ): Promise<FlattenedJWE> {
    try {
      const service = DIDResolverService.getServiceOfType(
        didDoc,
        'DIDCommMessaging',
      );
      if (service.routingKeys.length > 1) {
        throw Error(`Multiple DIDComm routing keys not yet supported`);
      }
      if (service.routingKeys.length === 0) {
        throw Error(`No DIDComm routing key entry found in service block`);
      }
      const key = didDoc.verificationMethod.find(
        (v) => v.id === service.routingKeys[0],
      );
      if (!key) {
        throw Error(`DIDComm routing key not found in verification methods`);
      }

      const encoder = new TextEncoder();
      const jwe = await new FlattenedEncrypt(
        encoder.encode(JSON.stringify(msg)),
      )
        .setProtectedHeader({
          alg: 'ECDH-ES+A256KW',
          kid: key.id,
          typ: DIDCommMessageMediaType.ENCRYPTED,
          enc: 'A256GCM',
        })
        .encrypt(await parseJwk(key.publicKeyJwk, 'ECDH-ES+A256KW'));
      return jwe;
    } catch (e) {
      throw e;
    }
  }

  async sendMessage(didDoc: IDIDDocument, msg: FlattenedJWE): Promise<boolean> {
    const service = DIDResolverService.getServiceOfType(
      didDoc,
      'DIDCommMessaging',
    );
    if (typeof service.serviceEndpoint !== 'string') {
      // TODO log actual thing here so we can see what an obj looks like in practice
      throw Error('Only service endpoints that are strings are supported');
    }
    const resp = await axios.post(service.serviceEndpoint, msg);
    return resp.status === 200 || resp.status === 201;
  }

  async decryptMessage(
    msg: IDIDCommEncryptedMessage,
    jwk: JWK,
  ): Promise<IDIDCommPlaintextMessage> {
    const key = await parseJwk(jwk, 'ECDH-ES+A256KW');
    const decoder = new TextDecoder();
    const { plaintext, protectedHeader, additionalAuthenticatedData } =
      await flattenedDecrypt(msg, key);
    return JSON.parse(decoder.decode(plaintext)) as IDIDCommPlaintextMessage;
  }

  async unpackMessage(
    msg: IDIDCommEncryptedMessage,
  ): Promise<IDIDCommPlaintextMessage> {
    if (msg.mediaType === DIDCommMessageMediaType.ENCRYPTED) {
      const prot = JSON.parse(
        Buffer.from(msg.protected, 'base64').toString('utf-8'),
      );
      const jwk = this.db.getKey(prot['kid']) as JWK;
      const decodedMessage = await this.decryptMessage(msg, jwk);
      return { mediaType: DIDCommMessageMediaType.PLAIN, ...decodedMessage };
    } else if (msg.mediaType === DIDCommMessageMediaType.SIGNED) {
      // not yet supported
      throw new NotImplementedException(
        `${msg.mediaType} not supported in WACI-PEx v0.1`,
      );
    }
    throw Error(`DIDComm media type not supported: ${msg.mediaType}`);
  }

  handleMessage(message: IDIDCommPlaintextMessage) {}
}
