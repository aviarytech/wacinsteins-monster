import { ApiProperty } from '@nestjs/swagger';

export class SubmitCredentialForPresentationDto {
  @ApiProperty()
  credentialId: string;
}
