import { Injectable, Logger } from '@nestjs/common';
import { DIDResolverService } from '../dids/didresolver.service';

import {
  DIDComm,
  IDIDCommMessage,
  DIDCOMM_MESSAGE_MEDIA_TYPE,
} from '@aviarytech/didcomm-messaging';
import { KMSService } from '../kms/kms.service';
import { IJWE } from '@aviarytech/did-secrets/node_modules/@aviarytech/crypto-core';
import {
  DefaultTrustPingMessageHandler,
  DefaultTrustPingResponseMessageHandler,
} from '@aviarytech/didcomm-protocols.trust-ping';

@Injectable()
export class DIDCommService {
  private didcomm: DIDComm;
  constructor(
    private didResolver: DIDResolverService,
    private kms: KMSService,
  ) {
    this.didcomm = new DIDComm(
      [
        new DefaultTrustPingMessageHandler(),
        new DefaultTrustPingResponseMessageHandler(),
        {
          type: 'BasicMessage',
          handle: async (m) => {
            console.log(m);
            return true;
          },
        },
      ],
      this.didResolver,
      this.kms,
    );
  }

  async sendMessage(toDid: string, msg: IDIDCommMessage): Promise<boolean> {
    try {
      return await this.didcomm.sendMessage(toDid, msg);
    } catch (e) {
      return false;
    }
  }

  async receiveMessage(msg: IJWE): Promise<boolean> {
    try {
      const resp = await this.didcomm.receiveMessage(
        msg,
        DIDCOMM_MESSAGE_MEDIA_TYPE.ENCRYPTED,
      );
      return resp;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
