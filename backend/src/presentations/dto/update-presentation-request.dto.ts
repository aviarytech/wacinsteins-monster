import { PartialType } from '@nestjs/swagger';
import { VerifiablePresentation } from '@transmute/vc.js/dist/types/VerifiablePresentation';
import { VerifiableCredential } from 'src/credentials/interfaces';
import {
  PresentationProposal,
  PresentationRequest,
  PRESENTATION_REQUEST_STATUSES,
} from '../entities/presentation.entity';
import { CreatePresentationRequestDto } from './create-presentation-request.dto';

export class UpdatePresentationRequestDto extends PartialType(
  PresentationRequest,
) {
  proposal?: PresentationProposal;
  status?: PRESENTATION_REQUEST_STATUSES;
  derivedCredentials?: VerifiableCredential[];
  presentations?: any[];
}
