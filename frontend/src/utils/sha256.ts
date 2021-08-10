import { hash } from "@stablelib/sha256";

export const sha256 = (val: string) => {
  var enc = new TextEncoder();
  return hash(enc.encode(val));
};
