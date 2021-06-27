import { IBaseDIDCommMessage } from './IBaseDIDCommMessage';

export interface IDIDCommEncryptedMessage extends IBaseDIDCommMessage {
  ciphertext: string;
  iv: string;
  tag: string;
  encrypted_key: string;
  aad: string;
  protected: string;
}
