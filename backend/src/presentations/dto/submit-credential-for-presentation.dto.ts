import { ApiProperty } from '@nestjs/swagger';
import { VerifiableCredential } from '../../credentials/interfaces';

export class SubmitCredentialForPresentationDto {
  @ApiProperty()
  verifiableCredential: VerifiableCredential;
}
