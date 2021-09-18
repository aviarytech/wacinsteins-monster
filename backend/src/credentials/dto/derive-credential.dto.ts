import { VerifiableCredential } from '../interfaces';

export class DeriveCredentialOptions {
  credentialId: string;
  verifiableCredential: VerifiableCredential;
  frame: object;
}
