import { IBaseDIDCommMessage } from './IBaseDIDCommMessage';

export interface IDIDCommSignedMessage extends IBaseDIDCommMessage {
  header: {
    typ: string;
    cty: string;
  };
  payload: any;
  signature: string;
}
