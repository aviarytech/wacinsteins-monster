import { IDIDComm } from '@aviarytech/didcomm-messaging';
import {
  BasicMessageMessageHandler,
  BasicMessageMessage,
} from '@aviarytech/didcomm-protocols.basic-message';

export class BasicMessageHandler extends BasicMessageMessageHandler {
  private callback;
  constructor(callback: (payload) => void) {
    super();
    this.callback = callback;
  }

  async handle(props: {
    message: BasicMessageMessage;
    didcomm: IDIDComm;
  }): Promise<boolean> {
    await this.callback(props.message.payload);
    return await super.handle(props);
  }
}
