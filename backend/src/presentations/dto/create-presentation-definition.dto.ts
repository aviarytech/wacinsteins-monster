import { ApiProperty } from '@nestjs/swagger';

export class CreatePresentationDefinitionDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  schema: string;

  @ApiProperty()
  paths: string[]; // assuming type string for now
}
