import { Injectable, Logger } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { nanoid } from 'nanoid';
import { DBService } from 'src/db/db.service';
import { InvitationMessage } from '@aviarytech/didcomm-protocols.out-of-band';
import { mapValidationErrorsToMessages } from 'src/utils/errors';
import { sha256 } from 'src/utils/sha256';
import {
  IDIFPresentationExchangeSubmission,
  SUBMISSION_FORMATS,
} from '@aviarytech/dif-presentation-exchange';

import {
  InputDescriptor,
  PresentationDefinition,
  PresentationRequest,
  PRESENTATION_REQUEST_ROLES,
  PRESENTATION_REQUEST_STATUSES,
} from './entities/presentation.entity';
import { DIDWebService } from 'src/didweb/didweb.service';
import { UpdatePresentationRequestDto } from './dto/update-presentation-request.dto';
import { ConfigService } from '@nestjs/config';
import { VerifiableCredential } from 'src/credentials/interfaces';
import { verifiable } from '@transmute/vc.js';
import { DocumentLoaderService } from 'src/documentLoader/documentLoader.service';
import { JsonWebKey, JsonWebKey2020, JWS } from '@aviarytech/crypto-core';

@Injectable()
export class PresentationsService {
  constructor(
    private db: DBService,
    private log: Logger,
    private didWeb: DIDWebService,
    private config: ConfigService,
    private documentLoader: DocumentLoaderService,
  ) {}

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
    id?: string;
    definition: PresentationDefinition;
    role: PRESENTATION_REQUEST_ROLES;
    requester: string;
    invitationId?: string;
    status?: PRESENTATION_REQUEST_STATUSES;
  }): Promise<PresentationRequest> {
    let { definition, role, requester, invitationId, id, status } =
      createRequest;
    let url;
    if (!invitationId) {
      const invitation = new InvitationMessage(
        this.didWeb.did,
        this.didWeb.basePath + '/invitation',
        'streamlined-vp',
      );
      url = invitation.url;
      invitationId = invitation.payload.id;
    }
    id = id ?? invitationId;

    const domain = this.config.get('HOST');
    const presReq = new PresentationRequest(
      id,
      url,
      sha256(nanoid()),
      domain,
      definition,
      invitationId,
      role,
      requester,
      status,
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

  async findOneRequest(id: string): Promise<PresentationRequest> {
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

  async createPresentation(
    presentationRequestId: string,
    derivedCredential: VerifiableCredential,
  ) {
    const presentationRequest = await this.findOneRequest(
      presentationRequestId,
    );

    const submission: IDIFPresentationExchangeSubmission = {
      presentation_submission: {
        id: sha256(nanoid()),
        definition_id: presentationRequest.definition.id,
        descriptor_map: [
          {
            id: 'input',
            format: SUBMISSION_FORMATS.LinkedDataProof_VerifiablePresentation,
            path: '$.verifiableCredential[0]',
          },
        ],
      },
    };

    const presentation = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://identity.foundation/presentation-exchange/submission/v1',
        'https://w3id.org/security/suites/jws-2020/v1',
      ],
      type: ['VerifiablePresentation', 'PresentationSubmission'],
      holder: {
        id: this.didWeb.did,
      },
      verifiableCredential: [derivedCredential],
      ...submission,
    };

    const result = await verifiable.presentation.create({
      presentation,
      format: ['vp'],
      documentLoader: this.documentLoader.loader,
      challenge: presentationRequest.challenge,
      domain: presentationRequest.domain,
      suite: new JWS.Suite({
        key: await JsonWebKey.from(
          (await this.didWeb.getAuthenticationKey()) as JsonWebKey2020,
        ),
      }),
    });

    return result;
  }
}
