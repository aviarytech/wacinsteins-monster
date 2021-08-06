import { KeyPairJwk } from '@transmute/did-key-common/dist/types';
import * as ed25519 from '@transmute/did-key-ed25519';
import * as crypto from 'crypto';

export const generateEd25519 = async (): Promise<KeyPairJwk> => {
  const keyPair = await ed25519.Ed25519KeyPair.generate({
    secureRandom: () => {
      return crypto.randomBytes(32);
    },
  });
  return keyPair.toJsonWebKeyPair(true);
};
