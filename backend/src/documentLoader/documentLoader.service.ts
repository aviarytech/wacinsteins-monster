import { IDIDDocument } from '@aviarytech/did-core';
import { Injectable } from '@nestjs/common';
import * as cre from '@transmute/credentials-context';
import * as sec from '@transmute/security-context';
import * as did from '@transmute/did-context';
import { DIDWebService } from '../didweb/didweb.service';
import { DIDKeyService } from 'src/didkey/didkey.service';
import vax from './contexts/vax-v1.json';
import presentationExchange from './contexts/presentation-exchange.json';
import examples from './contexts/creds-examples-v1.json';
import citz from './contexts/citizenship-v1.json';
import odrl from './contexts/odrl.json';
import secv3 from './contexts/sec-v3.json';

@Injectable()
export class DocumentLoaderService {
  loader: any;
  contexts: any;

  constructor(private didWeb: DIDWebService, private didKey: DIDKeyService) {
    this.contexts = {
      // did contexts
      [did.constants.DID_CONTEXT_V1_URL]: did.contexts.get(
        did.constants.DID_CONTEXT_V1_URL,
      ),

      // credential contexts
      [cre.constants.CREDENTIALS_CONTEXT_V1_URL]: cre.contexts.get(
        cre.constants.CREDENTIALS_CONTEXT_V1_URL,
      ),
      ['https://www.w3.org/2018/credentials/examples/v1']: examples,

      // credential suites
      [sec.constants.JSON_WEB_SIGNATURE_2020_V1_URL]: sec.contexts.get(
        sec.constants.JSON_WEB_SIGNATURE_2020_V1_URL,
      ),

      [sec.constants.BLS12381_2020_V1_URL]: sec.contexts.get(
        sec.constants.BLS12381_2020_V1_URL,
      ),

      // security contexts... these are required by mattr suite... but should not be
      'https://w3id.org/security/bbs/v1': sec.contexts.get(
        sec.constants.BLS12381_2020_V1_URL,
      ),
      'https://w3id.org/security/v2': sec.contexts.get(
        sec.constants.SECURITY_CONTEXT_V2_URL,
      ),
      'https://w3id.org/security/v1': sec.contexts.get(
        sec.constants.SECURITY_CONTEXT_V1_URL,
      ),

      'https://w3id.org/vaccination/v1': vax,
      'https://identity.foundation/presentation-exchange/submission/v1':
        presentationExchange,
      'https://w3id.org/citizenship/v1': citz,

      'https://www.w3.org/ns/odrl.jsonld': odrl,
    };
    this.loader = async (iri: string) => {
      const context = await this.contextResolver(iri);
      if (context) {
        return context;
      }

      const resolution = await this.documentResolver(iri);

      if (resolution) {
        return resolution;
      }

      const message = 'Unsupported iri: ' + iri;
      console.error(message);
      throw new Error(message);
    };
  }

  async documentResolver(iri: string) {
    let doc;
    if (iri.startsWith('did:web')) {
      doc = await this.didWeb.resolve(iri);
    }
    if (iri.startsWith('did:key')) {
      doc = await this.didKey.resolve(iri);
    }

    if (doc) {
      return { document: doc, documentUrl: iri, contextUrl: null };
    }

    return undefined;
  }

  async contextResolver(iri: string) {
    if (this.contexts[iri]) {
      return {
        document: this.contexts[iri],
        documentUrl: iri,
        contextUrl: null,
      };
    }
    return undefined;
  }

  async load(did: string): Promise<IDIDDocument> {
    try {
      return this.loader(did);
    } catch (e) {
      throw e;
    }
  }
}
