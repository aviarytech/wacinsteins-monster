import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateContactDto {
  @ApiProperty()
  @IsNotEmpty()
  did: string;
}
