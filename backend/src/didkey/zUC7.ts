import { Bls12381G2KeyPair } from '@mattrglobal/bls12381-key-pair';

export const resolve = async (did: string) => {
  const keyPair = Bls12381G2KeyPair.fromFingerprint({
    id: did,
    controller: did,
    fingerprint: did.split(':')[did.split(':').length - 1],
  });
  return {
    didDocument: {
      '@context': [
        'https://www.w3.org/ns/did/v1',
        'https://w3id.org/security/suites/bls12381-2020/v1',
      ],
      id: did,
      verificationMethod: [
        {
          id: did,
          type: 'Bls12381G2Key2020',
          controller: did,
          publicKeyBase58: keyPair.publicKey,
        },
      ],
      authentication: [did],
      assertionMethod: [did],
      capabilityDelegation: [did],
      capabilityInvocation: [did],
      keyAgreement: [],
    },
  };
};
