import { Injectable } from '@nestjs/common';
import { DocumentLoaderService } from '../documentLoader/documentLoader.service';
import {
  IDIDDocument,
  IDIDDocumentServiceDescriptor,
} from '@aviarytech/did-core';

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
