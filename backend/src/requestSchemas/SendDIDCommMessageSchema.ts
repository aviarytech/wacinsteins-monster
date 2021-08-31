import { IDIDCommPayload } from '@aviarytech/didcomm-core/dist/interfaces';
import { IsNotEmpty, IsObject } from 'class-validator';

export class SendDIDCommMessageSchema implements IDIDCommPayload {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  to: string;

  @IsObject()
  body: any;
}
