import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DBService } from 'src/db/db.service';
import { JSONWebKeyEntity } from 'src/db/entities/key';
import IDIDDocument from 'src/interfaces/IDIDDocument';
import { generateEd25519 } from 'src/kms/ed25519';
import { generateX25519 } from 'src/kms/x25519';
import { generateBls12381G1, generateBls12381G2 } from 'src/kms/bls12381';
import { DocumentLoaderService } from 'src/documentLoader/documentLoader.service';
import IDIDDocumentServiceDescriptor from 'src/interfaces/IDIDDocumentServiceDescriptor';

@Injectable()
export class DIDResolverService {
  constructor(private documentLoader: DocumentLoaderService) {}

  async resolve(did: string): Promise<IDIDDocument> {
    return (await this.documentLoader.load(did)).document;
  }

  public static getServiceOfType(
    didDoc: IDIDDocument,
    serviceType: string,
  ): IDIDDocumentServiceDescriptor {
    const didCommService = didDoc.service.find((s) => s.type === serviceType);
    if (!didCommService) {
      throw Error(
        `Incompatible DID '${didDoc.id}', no '${serviceType}' service`,
      );
    }
    return didCommService;
  }
}
