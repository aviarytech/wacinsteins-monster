import { ApiProperty } from '@nestjs/swagger';

export class AcceptInvitationDto {
  @ApiProperty()
  url: string;

}
