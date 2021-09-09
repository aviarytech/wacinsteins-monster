import { ApiProperty } from '@nestjs/swagger';
import { PRESENTATION_REQUEST_ROLES } from '../entities/presentation.entity';

export class CreatePresentationRequestDto {
  @ApiProperty()
  presentationDefinitionId: string;
}
