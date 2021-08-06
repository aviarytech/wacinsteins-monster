import { Injectable } from '@nestjs/common';
import { DIDResolverService } from '../dids/didresolver.service';

import { DBService } from '../db/db.service';
import { IDIDDocument } from '@aviarytech/did-core';
import { DIDComm } from '@aviarytech/didcomm-core';
import {
  IDIDCommEncryptedMessage,
  IDIDCommPlaintextPayload,
} from '@aviarytech/didcomm-core/dist/interfaces';
import { JsonWebKey } from '@transmute/json-web-signature';
import { JsonWebKey2020 } from '@transmute/web-crypto-key-pair';
import { X25519KeyAgreementKey2019 } from '@transmute/x25519-key-pair';
import { KMSService } from '../kms/kms.service';

@Injectable()
export class DIDCommService {
  private didcomm: DIDComm;
  constructor(
    private didResolver: DIDResolverService,
    private kms: KMSService,
  ) {
    this.didcomm = new DIDComm();
  }

  async createMessage(
    didDoc: IDIDDocument,
    msg: IDIDCommPlaintextPayload,
  ): Promise<IDIDCommEncryptedMessage> {
    try {
      return await this.didcomm.createMessage(didDoc, msg);
    } catch (e) {
      throw e;
    }
  }

  async sendMessage(
    didDoc: IDIDDocument,
    msg: IDIDCommEncryptedMessage,
  ): Promise<boolean> {
    try {
      return await this.didcomm.sendMessage(didDoc, msg);
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async unpackMessage(
    mediaType: string,
    msg: IDIDCommEncryptedMessage,
  ): Promise<IDIDCommPlaintextPayload> {
    console.log(msg.recipients[0].header);
    const keyId = DIDComm.getKeyIdFromMessage(msg);
    const key = await this.kms.getKey(keyId);
    return await this.didcomm.unpackMessage(
      mediaType,
      key as X25519KeyAgreementKey2019,
      msg,
    );
  }

  // handleMessage(message: IDIDCommPlaintextMessage) {}
}
