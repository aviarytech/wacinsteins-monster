import { Injectable, Logger } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { nanoid } from 'nanoid';
import { DBService } from 'src/db/db.service';
import { InvitationMessage } from '@aviarytech/didcomm-protocols.out-of-band';
import { mapValidationErrorsToMessages } from 'src/utils/errors';
import { sha256 } from 'src/utils/sha256';
import { CreatePresentationDefinitionDto } from './dto/create-presentation-definition.dto';

import { CreatePresentationRequestDto } from './dto/create-presentation-request.dto';

import {
  InputConstraint,
  InputDescriptor,
  InputField,
  InputFilter,
  PresentationDefinition,
  PresentationRequest,
  PRESENTATION_REQUEST_ROLES,
} from './entities/presentation.entity';
import { DIDWebService } from 'src/didweb/didweb.service';
import { UpdatePresentationRequestDto } from './dto/update-presentation-request.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PresentationsService {
  constructor(
    private db: DBService,
    private log: Logger,
    private didWeb: DIDWebService,
    private config: ConfigService,
  ) { }

  async createDefinition(
    createPresentationDefinitionDto: {
      input_descriptors: InputDescriptor[];
      frame: object;
    },
    id?: string,
  ) {
    const { input_descriptors, frame } = createPresentationDefinitionDto;
    id = id ?? sha256(nanoid());
    const definition = new PresentationDefinition(id, frame, input_descriptors);

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

  async createRequest(createRequest: {
    definition: PresentationDefinition;
    role: PRESENTATION_REQUEST_ROLES;
  }): Promise<PresentationRequest> {
    const { definition, role } = createRequest;
    const invitation = new InvitationMessage(
      this.didWeb.did,
      this.didWeb.basePath + '/invitation',
      'streamlined-vp',
    );
    const id = sha256(nanoid());
    const url = invitation.url;
    const domain = this.config.get('HOST');

    const presReq = new PresentationRequest(
      id,
      url,
      sha256(nanoid()),
      domain,
      definition,
      invitation.payload.id,
      role,
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

  async findOneRequestByInvitationId(id: string): Promise<PresentationRequest> {
    return await this.db.getByProps({
      '@type': 'PresentationRequest',
      invitationId: id,
    });
  }

  async updatePresentationRequest(
    id: string,
    updatePresentationRequest: UpdatePresentationRequestDto,
  ): Promise<PresentationRequest> {
    const request = await this.db.getById(id);
    return await this.db.upsert({
      id,
      ...request,
      ...updatePresentationRequest,
    });
  }
}
