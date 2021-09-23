import { persistable } from "../utils/persistable";

export const identities = persistable("identities", null);
export const extendedPubKeys = persistable("xPubKeys", []);
