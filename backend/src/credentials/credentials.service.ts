import { Injectable } from '@nestjs/common';
import { DBService } from 'src/db/db.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';

@Injectable()
export class CredentialsService {
  constructor(private db: DBService) {}

  create(createCredentialDto: CreateCredentialDto) {
    return 'This action adds a new credential';
  }

  findAll({subjectType: string}) {
    if ()
    return await this.db.getByProps('credentialSubject');
    return `This action returns all credentials`;
  }

  findOne(id: string) {
    return `This action returns a #${id} credential`;
  }

  update(id: string, updateCredentialDto: UpdateCredentialDto) {
    return `This action updates a #${id} credential`;
  }

  remove(id: string) {
    return `This action removes a #${id} credential`;
  }
}
