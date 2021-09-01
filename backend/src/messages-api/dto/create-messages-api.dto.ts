import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsString,IsDate } from "class-validator";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateMessagesApiDto {
  
  @ApiProperty()
  @IsString()
  to:string;
 
  @ApiProperty()
  @IsString()
  data:string;

  @ApiProperty()
  //@IsDate() 
  when:Date;
}
