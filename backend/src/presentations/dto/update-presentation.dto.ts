import { PartialType } from '@nestjs/swagger';
import {
  PresentationProposal,
  PRESENTATION_STATUSES,
} from '../entities/presentation.entity';
import { CreatePresentationDto } from './create-presentation.dto';

export class UpdatePresentationDto extends PartialType(CreatePresentationDto) {
  id: string;
  proposal: PresentationProposal;
  status: PRESENTATION_STATUSES;
}
