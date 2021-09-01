import { Injectable } from '@nestjs/common';
import { sha256 } from '../utils/sha256';
import { DBService } from '../db/db.service';
import { CreateMessagesApiDto } from './dto/create-messages-api.dto';

// import { UpdateMessagesApiDto } from './dto/update-messages-api.dto';
@Injectable()
export class MessagesApiService {
  constructor(private db: DBService) {}

  async create(createMessagesApiDto: CreateMessagesApiDto) {
    //general from/to id
    let id = sha256(JSON.stringify(createMessagesApiDto))
    //specific msg id
    try {
      const newMsg = await this.db.create({
        '@type': 'User-msg',
        id,
        msg: createMessagesApiDto,
      });
      return newMsg;
    } catch (e) {
      return null;
    }
  }

  async findAll() {
    return await this.db.getAllByType('User-msg');
  }

  async findOne(id: string) {
    return await this.db.getById(id);
  }
  
  //hash to/from user instead for a single query
  async findConversation(from:string, to:string) {
    const res = await this.db.getManyByProps(
      { $or: [
        {"msg.from":from,"msg.to":to},
        {"msg.from":to,"msg.to":from}
      ]}
    )
    console.log(res)
    return res
  }

//     return `This action updates a #${id} messagesApi`;
//   }
// 
//   remove(id: number) {
//     return `This action removes a #${id} messagesApi`;
//   }
}
