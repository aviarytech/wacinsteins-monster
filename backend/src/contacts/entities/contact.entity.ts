import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class Contact {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsArray()
  dids: string[];
}
