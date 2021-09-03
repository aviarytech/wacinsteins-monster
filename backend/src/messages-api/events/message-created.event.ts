import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SingleMessageInterface } from '../interfaces/message-api.interface';

export class MessageCreatedEvent {
  constructor(public readonly message: SingleMessageInterface) {}
}

@EventsHandler(MessageCreatedEvent)
export class MessageCreatedEventHandler
  implements IEventHandler<MessageCreatedEvent>
{
  constructor() {}

  async handle(event: MessageCreatedEvent) {
    console.log(`Message: ${event.message.id} created`);
  }
}
