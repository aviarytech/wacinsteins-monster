import { hash } from "@stablelib/sha256";

const bufferToHex = (buffer) => {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export const sha256 = (val: string) => {
  var enc = new TextEncoder();
  return bufferToHex(hash(enc.encode(val)));
};
