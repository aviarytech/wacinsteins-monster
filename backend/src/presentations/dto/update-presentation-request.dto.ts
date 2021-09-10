import { PartialType } from '@nestjs/swagger';
import {
  PresentationProposal,
  PRESENTATION_REQUEST_STATUSES,
} from '../entities/presentation.entity';
import { CreatePresentationRequestDto } from './create-presentation-request.dto';

export class UpdatePresentationRequestDto extends PartialType(
  CreatePresentationRequestDto,
) {
  id: string;
  proposal?: PresentationProposal;
  status?: PRESENTATION_REQUEST_STATUSES;
}
