import { IDIDCommAttachment } from './IDIDCommAttachment';
import { IBaseDIDCommMessage } from './IBaseDIDCommMessage';

export interface IDIDCommPlaintextPayload {
  id: string;
  type: string;
  from?: string;
  to: string;
  thid?: string;
  pthid?: string;
  expires_time?: string;
  created_time?: string;
  next?: string;
  from_prior?: string;
  body: any;
  attachments?: IDIDCommAttachment[];
}

export interface IDIDCommPlaintextMessage extends IBaseDIDCommMessage {
  header?: {
    typ: string;
    kid?: string;
    alg?: string;
  };
  payload?: IDIDCommPlaintextPayload;
  signature?: string;
  data?: string;
}
