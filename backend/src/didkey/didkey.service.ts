import { Injectable } from '@nestjs/common';
import { resolve } from '@transmute/did-key.js';

@Injectable()
export class DIDKeyService {
  constructor() {}

  async resolve(iri: string) {
    // because mattr suite does not verify from JWKs...

    if (iri.startsWith('did:key:z5T')) {
      const { didDocument } = await resolve(iri.split('#')[0], {
        accept: 'application/did+ld+json',
      });
      return {
        documentUrl: iri,
        document: didDocument,
      };
    } else {
      const { didDocument } = await resolve(iri.split('#')[0], {
        accept: 'application/did+json',
      });
      return {
        documentUrl: iri,
        document: didDocument,
      };
    }
  }
}
