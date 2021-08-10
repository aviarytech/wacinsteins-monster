import { Injectable, Logger } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { nanoid } from 'nanoid';
import { DBService } from 'src/db/db.service';
import { mapValidationErrorsToMessages } from 'src/utils/errors';
import { sha256 } from 'src/utils/sha256';
import { CreatePresentationDefinitionDto } from './dto/create-presentation-definition.dto';
import { CreatePresentationRequestDto } from './dto/create-presentation-request.dto';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import {
  InputConstraint,
  InputDescriptor,
  InputField,
  InputFilter,
  Presentation,
  PresentationDefinition,
  PresentationRequest,
} from './entities/presentation.entity';

@Injectable()
export class PresentationsService {
  constructor(private db: DBService, private log: Logger) {}

  async create(
    createPresentationDto: CreatePresentationDto,
  ): Promise<Presentation> {
    // todo
    return null;
  }

  async findAll(): Promise<Presentation[]> {
    return await this.db.getAllByType('Presentation');
  }

  async findOne(id: string): Promise<Presentation> {
    return await this.db.getById(id);
  }

  async createDefinition(
    createPresentationDefinitionDto: CreatePresentationDefinitionDto,
  ) {
    const { name, schema, paths } = createPresentationDefinitionDto;
    // const frame = descriptors2Frame(schema, paths);
    const frame = {};
    const id = sha256(nanoid());

    const definition = new PresentationDefinition(id, frame, [
      new InputDescriptor(
        sha256(nanoid()),
        name,
        schema,
        new InputConstraint(
          paths.map((p) => new InputField([p], new InputFilter('string'))),
        ),
      ),
    ]);

    await validateOrReject(definition, {
      validationError: { target: false },
    }).catch((e) => {
      this.log.error('validation failed. errors: ', e);
      throw new Error(mapValidationErrorsToMessages(e));
    });

    return await this.db.create({
      '@type': 'PresentationDefinition',
      '@id': id,
      ...JSON.parse(JSON.stringify(definition)),
    });
  }

  async findOneDefinition(id: string) {
    return await this.db.getById(id);
  }

  async findAllDefinitions() {
    return await this.db.getAllByType('PresentationDefinition');
  }

  async createRequest(
    createPresentationRequestDto: CreatePresentationRequestDto,
  ): Promise<PresentationRequest> {
    const { presentationDefinitionId } = createPresentationRequestDto;
    const presentationDefinition = await this.db.getById(
      presentationDefinitionId,
    );
    if (!presentationDefinition) {
      throw new Error(
        `Presentation Definition ${presentationDefinitionId} not found`,
      );
    }
    const id = sha256(nanoid());
    const url = 'REPLACE ME';
    const domain = 'REPLACE ME';
    const frame = {};

    const presReq = new PresentationRequest(
      id,
      url,
      sha256(nanoid()),
      domain,
      presentationDefinition,
    );

    await validateOrReject(presReq, {
      validationError: { target: false },
    }).catch((e) => {
      this.log.error('validation failed. errors: ', e);
      throw new Error(mapValidationErrorsToMessages(e));
    });

    return await this.db.create({
      '@type': 'PresentationRequest',
      '@id': id,
      ...JSON.parse(JSON.stringify(presReq)),
    });
  }

  async findOneRequest(id: string) {
    return await this.db.getById(id);
  }

  async findAllRequests() {
    return await this.db.getAllByType('PresentationRequest');
  }
}
