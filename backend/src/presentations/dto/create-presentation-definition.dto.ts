import { ApiProperty } from '@nestjs/swagger';

export class CreatePresentationDefinitionDto {
  @ApiProperty()
  schema: string;

  @ApiProperty()
  paths: string[]; // assuming type string for now
}
