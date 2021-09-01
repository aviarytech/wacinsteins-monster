import { ApiProperty } from "@nestjs/swagger";
import { IsString,IsDate } from "class-validator";

export class CreateMessagesApiDto {
  
  @ApiProperty()
  @IsString()
  who:string;
  
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
