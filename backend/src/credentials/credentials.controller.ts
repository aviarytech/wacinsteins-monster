import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CredentialsService } from './credentials.service';
import { DeriveCredentialOptions } from './dto/derive-credential.dto';
import { Credential, VerifiableCredential } from './interfaces';

@ApiTags('credentials')
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

  @Post('/derive')
  async deriveCredential(
    @Body() body: DeriveCredentialOptions,
  ): Promise<VerifiableCredential> {
    const derived = await this.credentialsService.deriveCredential(
      body.verifiableCredential,
      body.frame,
    );
    return derived;
  }
}
