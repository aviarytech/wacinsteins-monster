import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PresentationsService } from './presentations.service';

import {
  InputConstraint,
  InputDescriptor,
  InputField,
  InputFilter,
  PresentationRequest,
  PRESENTATION_REQUEST_ROLES,
} from './entities/presentation.entity';
import { CreatePresentationDefinitionDto } from './dto/create-presentation-definition.dto';
import { CreatePresentationRequestDto } from './dto/create-presentation-request.dto';
import { ApiTags } from '@nestjs/swagger';
import { nanoid } from 'nanoid';
import { base64url, sha256 } from '@aviarytech/crypto-core';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';

@ApiTags('presentations')
@Controller('presentations')
export class PresentationsController {
  constructor(private readonly presentationsService: PresentationsService) { }

  @Post('requests')
  async create(
    @Body() createPresentationRequestDto: CreatePresentationRequestDto,
  ): Promise<PresentationRequest> {
    try {
      if (!createPresentationRequestDto.presentationDefinitionId) {
        throw new HttpException(
          'presentationDefinitionId is a required field',
          HttpStatus.BAD_REQUEST,
        );
      }
      const definition = await this.presentationsService.findOneDefinition(
        createPresentationRequestDto.presentationDefinitionId,
      );
      if (!definition) {
        throw new HttpException(
          'Presentation Definition not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return await this.presentationsService.createRequest({
        definition,
        role: PRESENTATION_REQUEST_ROLES.VERIFIER,
      });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('requests')
  async findAll(): Promise<PresentationRequest[]> {
    return await this.presentationsService.findAllRequests();
  }

  @Get('requests/:id')
  async findOne(@Param('id') id: string): Promise<PresentationRequest> {
    return await this.presentationsService.findOneRequest(id);
  }

  @Post('definitions')
  async createDefinition(
    @Body() createPresentationDefinitionDto: CreatePresentationDefinitionDto,
  ) {
    try {
      const input_descriptors = [
        new InputDescriptor(
          sha256(nanoid()),
          sha256(nanoid()),
          createPresentationDefinitionDto.schema,
          new InputConstraint(
            createPresentationDefinitionDto.paths.map(
              (p) => new InputField([p], new InputFilter('string')),
            ),
          ),
        ),
      ];
      return await this.presentationsService.createDefinition({
        input_descriptors,
        frame: createPresentationDefinitionDto.frame,
      });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('definitions/:id')
  async findOneDefinition(@Param('id') id: string) {
    return await this.presentationsService.findOneDefinition(id);
  }

  @Get('definitions')
  async findAllDefinitions() {
    return await this.presentationsService.findAllDefinitions();
  }

  @Post('acceptInvitation')
  async acceptInvitation(@Body() acceptInvitationDto: AcceptInvitationDto) {
    //WARN: regrexs way (not for the faint of hearts)
    // const regrexs = /(?<==).*/gmi
    // let res = regrexs.exec(acceptInvitationDto.url)[0]
    //return (base64url.decode(res))

    const url = new URL(acceptInvitationDto.url)
    let params = new URLSearchParams(url.search)
    console.log(params)
    console.log(base64url.decode(params.get('_oob')).toString())
    return base64url.decode(params.get('_oob')).toString()
    //return await this.presentationsService.acceptInvitation(url)
  }

}
