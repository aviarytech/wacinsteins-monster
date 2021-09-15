import { JsonWebKey, JWS } from '@aviarytech/crypto-core';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { verifiable } from '@transmute/vc.js';
import { VerifiablePresentation } from '@transmute/vc.js/dist/types/VerifiablePresentation';
import { VerifiableCredential } from '../credentials/interfaces';
import { DocumentLoaderService } from '../documentLoader/documentLoader.service';
import { VerifyOptions } from './verifier.controller';
import {
  BbsBlsSignature2020,
  BbsBlsSignatureProof2020,
  Bls12381G2KeyPair,
} from '@mattrglobal/jsonld-signatures-bbs';
@Injectable()
export class VerifierService {
  constructor(private documentLoader: DocumentLoaderService) {}

  async verifyPresentation(
    presentation: VerifiablePresentation,
    options: VerifyOptions,
  ) {
    const { challenge, domain } = options;
    const { verified, ...rest } = await verifiable.presentation.verify({
      presentation,
      format: ['vp', 'vp-jwt'],
      documentLoader: this.documentLoader.loader,
      challenge,
      domain,
      suite: new JWS.Suite({}),
    });
    return verified;
  }

  async verifyCredential(
    credential: VerifiableCredential,
    options: VerifyOptions,
  ) {
    let suite;
    const { proof } = credential;
    switch (proof['type']) {
      case 'BbsBlsSignature2020':
        suite = new BbsBlsSignature2020();
        break;
      case 'BbsBlsSignatureProof2020':
        suite = new BbsBlsSignatureProof2020();
        break;
      case 'JsonWebSignature2020':
        suite = new JWS.Suite({});
        break;
      default:
        throw new HttpException(
          `proof type ${proof['type']} not supported`,
          HttpStatus.BAD_REQUEST,
        );
    }
    if (proof['type']) {
      console.log(proof['type']);
    }
    const { verified, ...rest } = await verifiable.credential.verify({
      credential,
      format: ['vc'],
      documentLoader: this.documentLoader.loader,
      suite,
    });
    return verified;
  }
}
