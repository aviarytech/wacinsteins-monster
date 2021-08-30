import { Injectable } from '@nestjs/common';
import { DBService } from 'src/db/db.service';
import { sha256 } from 'src/utils/sha256';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private db: DBService) {}

  async create(createContactDto: CreateContactDto) {
    return await this.db.create({
      '@type': 'Contact',
      id: sha256(createContactDto.did),
      dids: [createContactDto.did],
    });
  }

  async findAll() {
    return await this.db.getAllByType('Contact');
  }

  async findOne(id: string) {
    return await this.db.getById(id);
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    return `This action updates a #${id} contact`;
  }
}
