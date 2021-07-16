import { IDIDCommEncryptedMessage } from '@aviarytech/didcomm-core/dist/interfaces';
import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { DIDCommService } from '../didcomm.service';
import { MessageDecryptedEvent } from '../events/message-decrypted.event';

export class ReceiveMessageCommand {
  constructor(
    public readonly mediaType: string,
    public readonly message: IDIDCommEncryptedMessage,
  ) {}
}

@CommandHandler(ReceiveMessageCommand)
export class ReceiveMessageHandler
  implements ICommandHandler<ReceiveMessageCommand>
{
  constructor(private eventBus: EventBus, private didcomm: DIDCommService) {}

  async execute(command: ReceiveMessageCommand) {
    const { mediaType, message } = command;
    const plainMessage = await this.didcomm.unpackMessage(mediaType, message);
    await this.eventBus.publish(new MessageDecryptedEvent(plainMessage));
  }
}
