export interface Key {
  id: string;
  type: string;
  controller: string;
  publicKeyBase58?: string;
  privateKeyBase58?: string;
  publicKeyJwk?: any;
  privateKeyJwk?: any;
}
