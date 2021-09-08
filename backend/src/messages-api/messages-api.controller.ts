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
import {
  BasicMessage,
  BASIC_MESSAGE_TYPE,
} from '@aviarytech/didcomm-protocols.basic-message';

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
    const basicMessage = new BasicMessage(
      this.didwebService.did,
      [createMessagesApiDto.to],
      createMessagesApiDto.data,
    );
    const msg = await this.messagesApiService.create({
      id: basicMessage.payload.id,
      from: basicMessage.payload.from,
      to: basicMessage.payload.to[0],
      data: basicMessage.payload.body.content,
      when: basicMessage.payload.created_time,
    });
    if (!msg) {
      throw new HttpException('Error creating msg', 400);
    }

    const sendResult = await this.didcomm.sendMessage(
      basicMessage.payload.to[0],
      basicMessage,
    );
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
