import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VerifiablePresentation } from '@transmute/vc.js/dist/types/VerifiablePresentation';
import { VerifiableCredential } from '../credentials/interfaces';
import { VerifierService } from './verifier.service';

export class VerifyOptions {
  verificationMethod: string;
  proofPurpose: string;
  created: string;
  challenge: string;
  domain: string;
}

class VerifyCredentialRequest {
  options: VerifyOptions;
  verifiableCredential: VerifiableCredential;
}

class VerifyPresentationRequest {
  options: VerifyOptions;
  verifiablePresentation: VerifiablePresentation;
}

@ApiTags('presentations')
@Controller('verifier')
export class VerifierController {
  constructor(private verifier: VerifierService) {}

  @Post('presentations/verify')
  async verifyPresentation(@Body() body: VerifyPresentationRequest) {
    let { verifiablePresentation, options } = body;
    options.challenge = verifiablePresentation.proof.challenge;
    options.domain = verifiablePresentation.proof.domain;
    const result = await this.verifier.verifyPresentation(
      verifiablePresentation,
      options,
    );
    if (result) {
      return result;
    }
    throw new HttpException('Verify failed', HttpStatus.BAD_REQUEST);
  }

  @Post('credentials/verify')
  async verifyCredential(@Body() body: VerifyCredentialRequest) {
    const { verifiableCredential, options } = body;
    const result = await this.verifier.verifyCredential(
      verifiableCredential,
      options,
    );
    if (result) {
      return result;
    }
    throw new HttpException('Verify failed', HttpStatus.BAD_REQUEST);
  }
}
