import { IDIDCommPayload } from '@aviarytech/didcomm-core/dist/interfaces';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class MessageDecryptedEvent {
  constructor(public readonly message: IDIDCommPayload) {}
}

@EventsHandler(MessageDecryptedEvent)
export class MessageDecryptedEventHandler
  implements IEventHandler<MessageDecryptedEvent>
{
  constructor() {}

  async handle(event: MessageDecryptedEvent) {
    console.log(event.message);
  }
}
