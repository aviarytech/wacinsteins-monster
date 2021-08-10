import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CredentialSubject } from './entities/credential.entity';

@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  /*
  * This is only an example so let's not create real credential trackers.
  *

  // @Post()
  // create(@Body() createCredentialDto: CreateCredentialDto) {
  //   return this.credentialsService.create(createCredentialDto);
  // }

  */

  @Get()
  findAll(@Query('subjectId') subjectId: string) {
    if (subjectId) {
      return this.credentialsService.findAllBySubjectId(subjectId);
    }
    return [];
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.credentialsService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCredentialDto: UpdateCredentialDto) {
  //   return this.credentialsService.update(+id, updateCredentialDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.credentialsService.remove(+id);
  // }
}
