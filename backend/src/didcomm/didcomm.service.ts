import { Injectable } from '@nestjs/common';
import { DIDResolverService } from '../dids/didresolver.service';

import {
  DIDComm,
  DIDCOMM_MESSAGE_MEDIA_TYPE,
  IDIDCommMessage,
} from '@aviarytech/didcomm-messaging';
import { BasicMessageHandler } from '@aviarytech/didcomm-protocols.basic-message';
import {
  ProposePresentationMessage,
  ProposePresentationMessageHandler,
} from '@aviarytech/didcomm-protocols.present-proof';
import { KMSService } from '../kms/kms.service';
import { DefaultTrustPingResponseMessageHandler } from '@aviarytech/didcomm-protocols.trust-ping';
import { TrustPingMessageHandler } from './handlers/trust-ping.handler';
import { ContactsService } from '../contacts/contacts.service';
import { IJWE } from '@aviarytech/crypto-core';
import { MessagesApiService } from '../messages-api/messages-api.service';
import { InvitationMessageHandler } from '@aviarytech/didcomm-protocols.out-of-band';
import { IDIDCommPayload } from '@aviarytech/didcomm-core';
import { DIDWebService } from 'src/didweb/didweb.service';
import { PresentationsService } from 'src/presentations/presentations.service';
import { PRESENTATION_STATUSES } from 'src/presentations/entities/presentation.entity';

@Injectable()
export class DIDCommService {
  private didcomm: DIDComm;
  constructor(
    private didResolver: DIDResolverService,
    private kms: KMSService,
    private contactsService: ContactsService,
    private messagesService: MessagesApiService,
    private didWeb: DIDWebService,
    private presentations: PresentationsService,
  ) {
    this.didcomm = new DIDComm(
      [
        new ProposePresentationMessageHandler(async (proposal, didcomm) => {
          const presentation =
            await this.presentations.findOneRequestByInvitationId(
              proposal.payload.pthid,
            );
          this.presentations.updatePresentationRequest(presentation.id, {
            id: presentation.id,
            status: PRESENTATION_STATUSES.PROPOSED,
            proposal: { from: proposal.payload.from },
          });
        }),
        new InvitationMessageHandler(async (i, didcomm) => {
          if (i.payload.body.goal_code === 'streamlined-vp') {
            const proposal = new ProposePresentationMessage(
              this.didWeb.did,
              [i.payload.from],
              i.payload.id,
            );
            await didcomm.sendMessage(i.payload.from, proposal);
          } else {
            console.log(
              `received unknown invitation goal_code: ${i.payload.body.goal_code}`,
            );
          }
        }),
        new BasicMessageHandler(async (m) => {
          const message = await this.messagesService.create({
            id: m.payload.id,
            from: m.payload.from,
            to: m.payload.to[0],
            data: m.payload.body.content,
            when: m.payload.created_time,
          });
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

  async receiveMessage(msg: IJWE | IDIDCommPayload): Promise<boolean> {
    try {
      if (msg['protected']) {
        return await this.didcomm.receiveMessage(
          msg as IJWE,
          DIDCOMM_MESSAGE_MEDIA_TYPE.ENCRYPTED,
        );
      } else if (msg['type']) {
        return await this.didcomm.receiveMessage(
          msg as IDIDCommPayload,
          DIDCOMM_MESSAGE_MEDIA_TYPE.PLAIN,
        );
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
