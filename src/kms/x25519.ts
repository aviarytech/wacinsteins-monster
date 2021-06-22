import { JsonWebKeyPair } from '@transmute/did-key-common/dist/types';
import * as x25519 from '@transmute/did-key-x25519';
import * as crypto from 'crypto';

export const generateX25519 = async (): Promise<JsonWebKeyPair> => {
  const keyPair = await x25519.X25519KeyPair.generate({
    secureRandom: () => {
      return crypto.randomBytes(32);
    },
  });
  return keyPair.toJsonWebKeyPair(true);
};
