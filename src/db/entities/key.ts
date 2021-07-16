import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';


export interface KeyEntity extends InMemoryDBEntity {
  id: string;
  type: string;
  controller: string;
  publicKeyBase58?: string;
  privateKeyBase58?: string;
  publicKeyJwk?: any;
  privateKeyJwk?: any;
}
