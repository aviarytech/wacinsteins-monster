import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
} from '@nestjs/common';
import { MessagesApiService } from './messages-api.service';
import { CreateMessagesApiDto } from './dto/create-messages-api.dto';
//import { UpdateMessagesApiDto } from './dto/update-messages-api.dto';
import { ApiTags } from '@nestjs/swagger';
import { sha256 } from '../utils/sha256';
import { DIDWebService } from '../didweb/didweb.service';
import { DIDCommService } from '../didcomm/didcomm.service';
import { BASIC_MESSAGE_TYPE } from '@aviarytech/didcomm-protocols.basic-message';

@ApiTags('messages-api')
@Controller('messages-api')
export class MessagesApiController {
  constructor(
    private readonly messagesApiService: MessagesApiService,
    private readonly didwebService: DIDWebService,
    private readonly didcomm: DIDCommService,
  ) {}

  @Post()
  async create(@Body() createMessagesApiDto: CreateMessagesApiDto) {
    let id = sha256(JSON.stringify(createMessagesApiDto));
    const msg = await this.messagesApiService.create({
      ...createMessagesApiDto,
      id,
      from: this.didwebService.did,
    });
    if (!msg) {
      throw new HttpException('Error creating msg', 400);
    }
    const sendResult = await this.didcomm.sendMessage(msg.msg.to, {
      payload: {
        id,
        type: BASIC_MESSAGE_TYPE,
        from: this.didwebService.did,
        to: [msg.msg.to],
        created_time: msg.msg.when,
        body: { content: msg.msg.data },
      },
      repudiable: false,
    });
    return msg;
  }

  @Get()
  findAll() {
    return this.messagesApiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesApiService.findOne(id);
  }
  @Get('conversation/:to')
  findConversation(@Param('to') to: string) {
    return this.messagesApiService.findConversation(this.didwebService.did, to);
  }
  //   @Patch(':id')
  //   update(@Param('id') id: string, @Body() updateMessagesApiDto: UpdateMessagesApiDto) {
  //     return this.messagesApiService.update(+id, updateMessagesApiDto);
  //   }
  //
  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.messagesApiService.remove(+id);
  //   }
}
