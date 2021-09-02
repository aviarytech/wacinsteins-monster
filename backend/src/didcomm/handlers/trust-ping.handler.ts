import { IDIDComm } from '@aviarytech/didcomm-messaging';
import {
  DefaultTrustPingMessageHandler,
  TrustPingMessage,
} from '@aviarytech/didcomm-protocols.trust-ping';

export class TrustPingMessageHandler extends DefaultTrustPingMessageHandler {
  private callback;
  constructor(callback: (did: string) => void) {
    super();
    this.callback = callback;
  }

  async handle(props: {
    message: TrustPingMessage;
    didcomm: IDIDComm;
  }): Promise<boolean> {
    await this.callback(props.message.payload.from);
    return await super.handle(props);
  }
}
