import { Injectable } from '@nestjs/common';
import { resolve } from '@transmute/did-key.js';
import { resolve as resolve_zUC7 } from './zUC7';

@Injectable()
export class DIDKeyService {
  constructor() {}

  async resolve(iri: string) {
    // because mattr suite does not verify from JWKs...

    if (iri.startsWith('did:key:z5T')) {
      const { didDocument } = await resolve(iri.split('#')[0], {
        accept: 'application/did+ld+json',
      });
      return didDocument;
    }
    if (iri.startsWith('did:key:zUC7')) {
      const { didDocument } = await resolve_zUC7(iri.split('#')[0]);
      return didDocument;
    } else {
      const { didDocument } = await resolve(iri.split('#')[0], {
        accept: 'application/did+ld+json',
      });
      return didDocument;
    }
  }
}
