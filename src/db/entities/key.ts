import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export interface JSONWebKeyEntity extends JsonWebKey, InMemoryDBEntity {
  id: string;
}
