import { Injectable, Logger } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { nanoid } from 'nanoid';
import { DBService } from 'src/db/db.service';
import { mapValidationErrorsToMessages } from 'src/utils/errors';
import { sha256 } from 'src/utils/sha256';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
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
    const { name, schema, paths } = createPresentationDto;
    const url = 'REPLACE ME';
    const domain = 'REPLACE ME';
    const frame = {};
    const pres = new Presentation(
      sha256(nanoid()),
      new PresentationRequest(
        sha256(nanoid()),
        url,
        sha256(nanoid()),
        domain,
        new PresentationDefinition(sha256(nanoid()), frame, [
          new InputDescriptor(
            sha256(nanoid()),
            name,
            schema,
            new InputConstraint([
              new InputField(paths, new InputFilter('string')),
            ]),
          ),
        ]),
      ),
    );

    await validateOrReject(pres, { validationError: { target: false } }).catch(
      (e) => {
        this.log.error('validation failed. errors: ', e);
        throw new Error(mapValidationErrorsToMessages(e));
      },
    );

    return await this.db.create({
      '@type': 'Presentation',
      '@id': sha256(nanoid()),
      ...JSON.parse(JSON.stringify(pres)),
    });
  }

  async findAll(): Promise<Presentation[]> {
    return await this.db.getAllByType('Presentation');
  }

  async findOne(id: string): Promise<Presentation> {
    return await this.db.getById(id);
  }

  update(id: number, updatePresentationDto: UpdatePresentationDto) {
    return `This action updates a #${id} presentation`;
  }

  remove(id: number) {
    return `This action removes a #${id} presentation`;
  }
}
