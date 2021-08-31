import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';
import { ContactCreatedEvent } from '../../contacts/events/new-contact.event';
import { SendTrustPingCommand } from '../commands/send-trust-ping.command';

@Injectable()
export class ContactCreatedSaga {
  @Saga()
  dragonKilled = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(ContactCreatedEvent),
      map((event) => new SendTrustPingCommand(event.did)),
    );
  };
}
