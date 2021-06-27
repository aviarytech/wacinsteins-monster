import IDIDDocumentServiceDescriptor from './IDIDDocumentServiceDescriptor';
import IDIDDocumentVerificationMethod from './IDIDDocumentVerificationMethod';
/**
 * Interface describing the expected shape of a Decentralized Identity Document.
 */
export default interface IDIDDocument {
  /** The standard context for DID Documents. */
  '@context': string[];
  /** The DID to which this DID Document pertains. */
  id: string;
  /** Array of verification methods associated with the DID. */
  verificationMethod?: IDIDDocumentVerificationMethod[];
  /** Array of services associated with the DID. */
  service?: IDIDDocumentServiceDescriptor[];
  /** Array of authentication methods. */
  authentication?: (string | IDIDDocumentVerificationMethod)[];
  /** Array of assertion methods. */
  assertionMethod?: (string | IDIDDocumentVerificationMethod)[];
  /** Array of key agreement methods */
  keyAgreement?: (string | IDIDDocumentVerificationMethod)[];
}
