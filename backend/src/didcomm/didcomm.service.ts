import { Injectable } from '@nestjs/common';
import { DIDResolverService } from '../dids/didresolver.service';

import {
  DIDComm,
  DIDCOMM_MESSAGE_MEDIA_TYPE,
  IDIDCommMessage,
} from '@aviarytech/didcomm-messaging';
import { KMSService } from '../kms/kms.service';
import { DefaultTrustPingResponseMessageHandler } from '@aviarytech/didcomm-protocols.trust-ping';
import { TrustPingMessageHandler } from './handlers/trust-ping.handler';
import { ContactsService } from '../contacts/contacts.service';
import { IJWE } from '@aviarytech/crypto-core';
import { BasicMessageHandler } from './handlers/basic-message.handler';
import { MessagesApiService } from '../messages-api/messages-api.service';

@Injectable()
export class DIDCommService {
  private didcomm: DIDComm;
  constructor(
    private didResolver: DIDResolverService,
    private kms: KMSService,
    private contactsService: ContactsService,
    private messagesService: MessagesApiService,
  ) {
    this.didcomm = new DIDComm(
      [
        new BasicMessageHandler(async (m) => {
          const message = await this.messagesService.create({
            id: m.id,
            from: m.from,
            to: m.to[0],
            data: m.body.content,
            when: m.created_time,
          });
          return message;
        }),
        new TrustPingMessageHandler(async (did) => {
          const exists = await this.contactsService.findByProps({ did: did });
          if (!exists) {
            this.contactsService.create({ did });
          }
        }),
        new DefaultTrustPingResponseMessageHandler(),
      ],
      this.didResolver,
      this.kms,
    );
  }

  async sendMessage(toDid: string, msg: IDIDCommMessage): Promise<boolean> {
    try {
      console.log(`Sending ${msg.payload.type} to ${toDid}`);
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
