import { IDIDCommPlaintextPayload } from '@aviarytech/didcomm-core/dist/interfaces';
import { IsNotEmpty, IsObject } from 'class-validator';

export class SendDIDCommMessageSchema implements IDIDCommPlaintextPayload {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  to: string;

  @IsObject()
  body: any;
}
