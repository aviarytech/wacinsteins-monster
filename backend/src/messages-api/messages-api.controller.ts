import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException } from '@nestjs/common';
import { MessagesApiService } from './messages-api.service';
import { CreateMessagesApiDto } from './dto/create-messages-api.dto';
//import { UpdateMessagesApiDto } from './dto/update-messages-api.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("messages-api")
@Controller('messages-api')
export class MessagesApiController {
  constructor(private readonly messagesApiService: MessagesApiService) {}

  @Post()
  async create(@Body() createMessagesApiDto: CreateMessagesApiDto) {
    const msg = await this.messagesApiService.create(createMessagesApiDto);
    if(!msg){
      throw new HttpException("Error creating msg", 400)
    }
    return msg
  }

  @Get()
  findAll() {
    return this.messagesApiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesApiService.findOne(id);
  }
  @Get('/:from/:to')
  findConversation(@Param('from') from: string, @Param("to") to:string) {
    return this.messagesApiService.findConversation(from,to);
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
