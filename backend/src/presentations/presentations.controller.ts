import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PresentationsService } from './presentations.service';

import {
  InputConstraint,
  InputDescriptor,
  InputField,
  InputFilter,
  PresentationRequest,
  PRESENTATION_REQUEST_ROLES,
  PRESENTATION_REQUEST_STATUSES,
} from './entities/presentation.entity';
import { CreatePresentationDefinitionDto } from './dto/create-presentation-definition.dto';
import { CreatePresentationRequestDto } from './dto/create-presentation-request.dto';
import { ApiTags } from '@nestjs/swagger';
import { nanoid } from 'nanoid';
import { base64url, sha256 } from '@aviarytech/crypto-core';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { DIDCommService } from 'src/didcomm/didcomm.service';
import { SubmitCredentialForPresentationDto } from './dto/submit-credential-for-presentation.dto';
import { CredentialsService } from 'src/credentials/credentials.service';
import { DIDWebService } from 'src/didweb/didweb.service';
import {
  PresentationMessage,
  RequestPresentationMessage,
} from '@aviarytech/didcomm-protocols.present-proof';
import { IDIDCommAttachment } from '@aviarytech/didcomm-core';
import { IDIFPresentationExchangeSubmissionAttachment } from '@aviarytech/didcomm-protocols.present-proof/dist/interfaces';
import {
  IDIFPresentationExchangeSubmission,
  SUBMISSION_FORMATS,
} from '@aviarytech/dif-presentation-exchange';

@ApiTags('presentations')
@Controller('presentations')
export class PresentationsController {
  constructor(
    private readonly presentationsService: PresentationsService,
    private readonly didCommService: DIDCommService,
    private readonly credentialsService: CredentialsService,
    private readonly didweb: DIDWebService,
    private readonly log: Logger,
  ) {}

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
        requester: this.didweb.did,
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

  @Post('requests/:id/submit')
  async submitPresentation(
    @Param('id') id: string,
    @Body() body: SubmitCredentialForPresentationDto,
  ): Promise<any> {
    let request = await this.presentationsService.findOneRequest(id);
    if (!request) {
      throw new HttpException('Presentation not found', HttpStatus.NOT_FOUND);
    }

    request = await this.presentationsService.updatePresentationRequest(
      request.id,
      {
        derivedCredentials: [
          ...request.derivedCredentials,
          body.verifiableCredential,
        ],
      },
    );

    const presentationResult =
      await this.presentationsService.createPresentation(
        request.id,
        body.verifiableCredential,
      );

    const presentations = presentationResult.items.map((pres) => {
      return pres;
    });

    const attachments: IDIFPresentationExchangeSubmissionAttachment[] =
      presentations.map((pres) => {
        return {
          id: sha256(nanoid()),
          media_type: 'application/ld+json',
          format: 'dif/presentation-exchange/submission@v1.0',
          data: {
            json: {
              dif: {
                presentation_submission: pres.presentation_submission,
                ...pres,
              },
            },
          },
        };
      });

    const presentationMessage = new PresentationMessage(
      this.didweb.did,
      [request.requester],
      request.invitationId,
      attachments,
    );
    const success = await this.didCommService.sendMessage(
      request.requester,
      presentationMessage,
    );
    if (success) {
      const updatedPresentation =
        await this.presentationsService.updatePresentationRequest(request.id, {
          status: PRESENTATION_REQUEST_STATUSES.SUBMITTED,
          presentations,
        });
      return presentations;
    }
    throw new HttpException(
      'Failed to send Presentation to requester',
      HttpStatus.BAD_REQUEST,
    );
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
    const url = new URL(acceptInvitationDto.url);
    let params = new URLSearchParams(url.search);
    let decodedBase64Data = base64url.decode(params.get('_oob')).toString();
    const id = JSON.parse(decodedBase64Data)['id'];
    await this.didCommService.receiveMessage(JSON.parse(decodedBase64Data));
    return { invitationId: id };
  }

  @Post('acceptProposal')
  async acceptProposal(
    @Body() acceptProposalDto: { presentationRequestId: string },
  ) {
    const request = await this.presentationsService.findOneRequest(
      acceptProposalDto.presentationRequestId,
    );
    if (!request) {
      this.log.error(`Presentation Request not found`);
      return;
    }
    if (request.status !== PRESENTATION_REQUEST_STATUSES.PROPOSED) {
      this.log.error(request);
      this.log.error(`Presentation Request or not in proposed state`);
      return;
    }
    const requestMessage = new RequestPresentationMessage(
      this.didweb.did,
      [request.proposal.from],
      request.invitationId,
      [
        {
          id: request.id,
          media_type: 'application/json',
          format: 'dif/presentation-exchange/definitions@v1.0',
          data: {
            json: {
              dif: {
                options: {
                  challenge: request.challenge,
                  domain: request.domain,
                },
                presentation_definition: {
                  id: request.definition.id,
                  frame: {
                    ...request.definition.frame,
                  },
                  input_descriptors: [...request.definition.input_descriptors],
                },
              },
            },
          },
        },
      ],
    );
    const requestSent = await this.didCommService.sendMessage(
      request.proposal.from,
      requestMessage,
    );
    if (requestSent) {
      const result = await this.presentationsService.updatePresentationRequest(
        request.id,
        {
          status: PRESENTATION_REQUEST_STATUSES.REQUESTED,
        },
      );
      return result;
    }
    this.log.error('Presentation Request failed to send');
    throw new HttpException(
      'Failed to accept Presentation Request',
      HttpStatus.BAD_REQUEST,
    );
  }
}
