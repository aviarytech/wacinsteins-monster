import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SendPongCommand } from './commands/send-pong.command';
import { MessageDecryptedEvent } from './events/message-decrypted.event';

@Injectable()
export class HandleMessageSaga {
  @Saga()
  dragonKilled = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(MessageDecryptedEvent),
      map((event) => {
        if (event.message.type === 'https://didcomm.org/trust_ping/1.0/ping') {
          return new SendPongCommand(event.message.from);
        }
      }),
    );
  };
}
