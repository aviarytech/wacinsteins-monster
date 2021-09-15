export interface Credential {
  '@type': 'Credential';
  id: string;
  verifiableCredential: VerifiableCredential;
  derivedCredentials: VerifiableCredential[];
}

export interface VerifiableCredential {
  '@context': string | string[];
  id: string;
  type: string | string[];
  credentialSubject: object;
  description?: string;
  expirationDate?: string;
  issuanceDate: string;
  issuer: string | { id: string };
  name?: string;
  proof: object;
}
