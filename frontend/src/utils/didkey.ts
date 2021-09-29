export const resolver = (
  context: string,
  verificationMethod: {
    id: string;
    type: string;
    controller: string;
    publicKeyBase58: string;
  }
) => {
  return {
    "@context": ["https://www.w3.org/ns/did/v1", context],
    id: verificationMethod.controller,
    verificationMethod: [verificationMethod],
    assertionMethod: [verificationMethod.id],
    authentication: [verificationMethod.id],
    capabilityInvocation: [verificationMethod.id],
    capabilityDelegation: [verificationMethod.id],
    keyAgreement: [verificationMethod.id],
  };
};
