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
import { CreatePresentationDto } from './dto/create-presentation.dto';
import {
  Presentation,
  PresentationRequest,
} from './entities/presentation.entity';
import { CreatePresentationDefinitionDto } from './dto/create-presentation-definition.dto';
import { CreatePresentationRequestDto } from './dto/create-presentation-request.dto';

@Controller('presentations')
export class PresentationsController {
  constructor(private readonly presentationsService: PresentationsService) {}

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
      return await this.presentationsService.createRequest(
        createPresentationRequestDto,
      );
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('requests')
  async findAll(): Promise<Presentation[]> {
    return await this.presentationsService.findAll();
  }

  @Get('requests/:id')
  async findOne(@Param('id') id: string) {
    return await this.presentationsService.findOne(id);
  }

  @Post('definitions')
  async createDefinition(
    @Body() createPresentationDefinitionDto: CreatePresentationDefinitionDto,
  ) {
    try {
      return await this.presentationsService.createDefinition(
        createPresentationDefinitionDto,
      );
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

  @Post('create')
  async createPresentation(
    @Body() createPresentationDto: CreatePresentationDto,
  ) {
    try {
      return await this.presentationsService.create(createPresentationDto);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOnePresentation(@Param('id') id: string) {
    return await this.presentationsService.findOne(id);
  }

  @Get()
  async findAllPresentation() {
    return await this.presentationsService.findAll();
  }
}
