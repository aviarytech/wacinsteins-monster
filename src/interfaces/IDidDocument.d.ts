import IDidDocumentServiceDescriptor from './IDidDocumentServiceDescriptor';
import IDidDocumentVerificationMethod from './IDidDocumentVerificationMethod';
/**
 * Interface describing the expected shape of a Decentralized Identity Document.
 */
export default interface IDidDocument {
  /** The standard context for DID Documents. */
  '@context': string[];
  /** The DID to which this DID Document pertains. */
  id: string;
  /** Array of verification methods associated with the DID. */
  verificationMethod?: IDidDocumentVerificationMethod[];
  /** Array of services associated with the DID. */
  service?: IDidDocumentServiceDescriptor[];
  /** Array of authentication methods. */
  authentication?: (string | IDidDocumentVerificationMethod)[];
  /** Array of assertion methods. */
  assertionMethod?: (string | IDidDocumentVerificationMethod)[];
  /** Array of key agreement methods */
  keyAgreement?: (string | IDidDocumentVerificationMethod)[];
}
