import {
  Bls12381G1KeyPair,
  Bls12381G2KeyPair,
} from '@transmute/did-key-bls12381';
import { JsonWebKeyPair } from '@transmute/did-key-common/dist/types';

export const generateBls12381G1 = async (): Promise<JsonWebKeyPair> => {
  const keyPair = await Bls12381G1KeyPair.generate();
  return keyPair.toJsonWebKeyPair(true);
};

export const generateBls12381G2 = async (): Promise<JsonWebKeyPair> => {
  const keyPair = await Bls12381G2KeyPair.generate();
  return keyPair.toJsonWebKeyPair(true);
};
