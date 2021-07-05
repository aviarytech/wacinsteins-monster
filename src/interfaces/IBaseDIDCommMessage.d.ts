import { JWTHeader } from 'did-jwt';

export const enum DIDCommMessageMediaType {
  PLAIN = 'application/didcomm-plain+json',
  SIGNED = 'application/didcomm-signed+json',
  ENCRYPTED = 'application/didcomm-encrypted+json',
}

export interface IBaseDIDCommMessage {
  mediaType: string;
}
