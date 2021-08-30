import { EventsHandler, IEventHandler, EventBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { BaseEvent, Merklize } from '../../base-event';
import { DBService } from 'src/db/db.service';

export class ContactCreatedEvent extends BaseEvent {
  constructor(public readonly id: string, public readonly did: string) {
    super();
  }
}

@EventsHandler(ContactCreatedEvent)
export class ContactCreatedEventHandler
  implements IEventHandler<ContactCreatedEvent>
{
  constructor(private log: Logger, private db: DBService) {}

  @Merklize()
  handle(event: ContactCreatedEvent) {
    this.log.verbose(event.id, 'contact created');
  }
}
