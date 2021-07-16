import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { DIDCommService } from '../didcomm.service';
import { MessageDecryptedEvent } from '../events/message-decrypted.event';

export class SendPongCommand {
  constructor(public readonly to: string) {}
}

@CommandHandler(SendPongCommand)
export class SendPongCommandHandler
  implements ICommandHandler<SendPongCommand>
{
  constructor(private eventBus: EventBus, private didcomm: DIDCommService) {}

  async execute(command: SendPongCommand) {
    const { to } = command;
    console.log(`sending pong to ${to}`);
  }
}
