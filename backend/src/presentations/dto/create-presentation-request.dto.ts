import { ApiProperty } from '@nestjs/swagger';

export class CreatePresentationRequestDto {
  @ApiProperty()
  presentationDefinitionId: string;
}
