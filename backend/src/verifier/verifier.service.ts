import { JsonWebKey, JWS } from '@aviarytech/crypto-core';
import { Injectable } from '@nestjs/common';
import { verifiable } from '@transmute/vc.js';
import { VerifiablePresentation } from '@transmute/vc.js/dist/types/VerifiablePresentation';
import { VerifiableCredential } from '../credentials/interfaces';
import { DocumentLoaderService } from '../documentLoader/documentLoader.service';
import { VerifyOptions } from './verifier.controller';

@Injectable()
export class VerifierService {
  constructor(private documentLoader: DocumentLoaderService) {}

  async verifyPresentation(
    presentation: VerifiablePresentation,
    options: VerifyOptions,
  ) {
    const { verified, ...rest } = await verifiable.presentation.verify({
      presentation,
      format: ['vp', 'vp-jwt'],
      documentLoader: this.documentLoader.loader,
      challenge: '123', // this is supplied by the verifier / presentation recipient
      suite: new JWS.Suite({}),
    });
    return verified;
  }

  async verifyCredential(
    credential: VerifiableCredential,
    options: VerifyOptions,
  ) {
    const { verified, ...rest } = await verifiable.credential.verify({
      credential,
      format: ['vc', 'vc-jwt'],
      documentLoader: this.documentLoader.loader,
      suite: new JWS.Suite({}),
    });
    return verified;
  }
}
