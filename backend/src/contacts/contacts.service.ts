import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { DBService } from 'src/db/db.service';
import { sha256 } from 'src/utils/sha256';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactCreatedEvent } from './events/new-contact.event';

@Injectable()
export class ContactsService {
  constructor(private db: DBService, private eventBus: EventBus) {}

  async create(createContactDto: CreateContactDto) {
    const id = sha256(createContactDto.did);
    try {
      const contact = await this.db.create({
        '@type': 'Contact',
        id,
        did: createContactDto.did,
      });
      await this.eventBus.publish(
        new ContactCreatedEvent(id, createContactDto.did),
      );
      return contact;
    } catch (e) {
      return null;
    }
  }

  async findByProps(props: object) {
    return await this.db.getByProps({ '@type': 'Contact', ...props });
  }

  async findAll() {
    return await this.db.getAllByType('Contact');
  }

  async findOne(id: string) {
    return await this.db.getById(id);
  }

  async findOneByProp(id: string) {
    return await this.db.getById(id);
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    return `This action updates a #${id} contact`;
  }
  async delete(id:string):Promise<any>{
    return await this.db.deleteById(id)
  }
}
