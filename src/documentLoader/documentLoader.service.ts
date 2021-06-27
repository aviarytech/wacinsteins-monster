import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DBService } from 'src/db/db.service';
import { JSONWebKeyEntity } from 'src/db/entities/key';
import IDIDDocument from 'src/interfaces/IDIDDocument';
import { generateEd25519 } from 'src/kms/ed25519';
import { generateX25519 } from 'src/kms/x25519';
import { generateBls12381G1, generateBls12381G2 } from 'src/kms/bls12381';
import { documentLoaderFactory } from '@transmute/jsonld-document-loader';
import axios from 'axios';

@Injectable()
export class DocumentLoaderService {
  private loader: any;

  constructor() {
    this.loader = documentLoaderFactory.pluginFactory
      .build()
      .addResolver({
        ['did:web']: {
          resolve: async (did: string) => {
            const [_, method, id, ...extras] = did.split(':');
            let domain = id.split('#').length > 1 ? id.split('#')[0] : id;
            if (id.indexOf('localhost') >= 0) {
              domain += `:${extras}`;
            }
            const resp = await axios.get(
              `http${
                id.indexOf('localhost') >= 0 ? null : 's'
              }://${domain}/.well-known/did.json`,
            );
            return resp.data;
          },
        },
      })
      .buildDocumentLoader();
  }

  async load(
    did: string,
  ): Promise<{
    contextUrl: string;
    documentUrl: string;
    document: IDIDDocument;
  }> {
    try {
      return this.loader(did);
    } catch (e) {
      throw e;
    }
  }
}
