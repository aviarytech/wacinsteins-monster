import {
  TrustPingMessage,
  TRUST_PING_PING_TYPE,
} from '@aviarytech/didcomm-protocols.trust-ping';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { nanoid } from 'nanoid';
import { DIDWebService } from 'src/didweb/didweb.service';
import { sha256 } from '../../utils/sha256';
import { DIDCommService } from '../didcomm.service';

export class SendTrustPingCommand {
  constructor(public readonly to: string) {}
}

@CommandHandler(SendTrustPingCommand)
export class SendTrustPingCommandHandler
  implements ICommandHandler<SendTrustPingCommand>
{
  constructor(
    private eventBus: EventBus,
    private didcomm: DIDCommService,
    private didWebService: DIDWebService,
  ) {}

  async execute(command: SendTrustPingCommand) {
    const { to } = command;
    const message: TrustPingMessage = {
      payload: {
        id: sha256(nanoid()),
        type: TRUST_PING_PING_TYPE,
        from: this.didWebService.did,
        to: [to],
        body: { response_requested: true },
      },
      repudiable: false,
    };
    return await this.didcomm.sendMessage(to, message);
  }
}
