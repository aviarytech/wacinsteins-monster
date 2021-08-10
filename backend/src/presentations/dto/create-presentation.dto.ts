import { ApiProperty } from '@nestjs/swagger';

export class CreatePresentationDto {
  @ApiProperty()
  presentationDefinitionId: string;
}
