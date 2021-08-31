import { Injectable } from '@nestjs/common';
import { DIDResolverService } from '../dids/didresolver.service';

import { DIDComm, IDIDCommMessage } from '@aviarytech/didcomm-messaging';
import { KMSService } from '../kms/kms.service';
import { IJWE } from '@aviarytech/did-secrets/node_modules/@aviarytech/crypto-core';
import { DIDCOMM_MESSAGE_MEDIA_TYPE } from '@aviarytech/didcomm-core/dist/constants';

@Injectable()
export class DIDCommService {
  private didcomm: DIDComm;
  constructor(
    private didResolver: DIDResolverService,
    private kms: KMSService,
  ) {
    this.didcomm = new DIDComm(
      [
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

  async sendMessage(msg: IDIDCommMessage): Promise<boolean> {
    try {
      return await this.didcomm.sendMessage(msg);
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
