import { BaseKeyPair, X25519KeyPair } from '@aviarytech/crypto-core';
import * as crypto from 'crypto';

export const generateX25519 = async (): Promise<X25519KeyPair> => {
  return await X25519KeyPair.generate({
    secureRandom: () => {
      return crypto.randomBytes(32);
    },
  });
};
