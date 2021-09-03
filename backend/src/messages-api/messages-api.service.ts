import { Injectable } from '@nestjs/common';
import { sha256 } from '../utils/sha256';
import { DBService } from '../db/db.service';
import { CreateMessagesApiDto } from './dto/create-messages-api.dto';
import { DIDWebService } from 'src/didweb/didweb.service';
import { SingleMessageInterface } from './interfaces/message-api.interface';
import { EventBus } from '@nestjs/cqrs';
import { MessageCreatedEvent } from './events/message-created.event';

// import { UpdateMessagesApiDto } from './dto/update-messages-api.dto';
@Injectable()
export class MessagesApiService {
  constructor(
    private db: DBService,
    private didWebService: DIDWebService,
    private eventBus: EventBus,
  ) {}

  async create(
    message: SingleMessageInterface,
  ): Promise<{ '@type': string; id: string; msg: SingleMessageInterface }> {
    //specific msg id
    try {
      const newMsg = await this.db.create({
        '@type': 'Message',
        id: message.id,
        msg: { ...message },
      });
      await this.eventBus.publish(new MessageCreatedEvent(newMsg.msg));
      return newMsg;
    } catch (e) {
      return null;
    }
  }

  async findAll() {
    return await this.db.getAllByType('Message');
  }

  async findOne(id: string) {
    return await this.db.getById(id);
  }

  //hash to/from user instead for a single query
  async findConversation(from: string, to: string) {
    const res: Promise<Object> = await this.db.getManyByProps({
      $or: [
        { 'msg.from': from, 'msg.to': to },
        { 'msg.from': to, 'msg.to': from },
      ],
    });
    return res;
  }

  //     return `This action updates a #${id} messagesApi`;
  //   }
  //
  //   remove(id: number) {
  //     return `This action removes a #${id} messagesApi`;
  //   }
}
