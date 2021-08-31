import { BaseKeyPair, Ed25519KeyPair } from '@aviarytech/crypto-core';
import * as crypto from 'crypto';

export const generateEd25519 = async (): Promise<BaseKeyPair> => {
  return await Ed25519KeyPair.generate({
    secureRandom: () => {
      return crypto.randomBytes(32);
    },
  });
};
