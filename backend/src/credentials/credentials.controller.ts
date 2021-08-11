import { Controller, Get, Param } from '@nestjs/common';
import { CredentialsService } from './credentials.service';

@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  /*
  * This is only an example so let's not create real credentials.
  *

  // @Post()
  // create(@Body() createCredentialDto: CreateCredentialDto) {
  //   return this.credentialsService.create(createCredentialDto);
  // }

  */

  @Get()
  async findAll(): Promise<Credential[]> {
    return await this.credentialsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Credential> {
    return await this.credentialsService.findOne(id);
  }
}
