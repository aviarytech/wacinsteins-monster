import { IsNotEmpty } from 'class-validator';

export class Credential {}

export class CredentialSubject {
  @IsNotEmpty()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
