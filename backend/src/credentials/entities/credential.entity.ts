import { IsNotEmpty } from 'class-validator';

export class Credential {
  @IsNotEmpty()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

export class CredentialSubject {
  @IsNotEmpty()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
