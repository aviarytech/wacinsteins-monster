import axios from "axios";
import pako from "pako";
import { Buffer } from "buffer/"; // note: the trailing slash is important!

import { compactVerify } from "jose/jws/compact/verify";
import { importJWK } from "jose/key/import";

/**
 * Extract data from a raw 'shc://' string
 * @param {string} rawSHC The raw 'shc://' string (from a QR code)
 * @return The header, payload and verification result of the SHC
 */
export const parseShc = async (rawSHC) => {
  const jwt = numericShcToJwt(rawSHC);
  const splitJwt = jwt.split(".");
  const header = parseJwtHeader(splitJwt[0]);
  const payload = parseJwtPayload(splitJwt[1]);
  const verifications = await verifySignature(jwt, payload.iss);

  return {
    header,
    payload,
    verifications,
  };
};

/**
 * Convert a SHC raw string to a standard JWT
 * @param {string} rawSHC The raw 'shc://' string (from a QR code)
 * @return {string} The encoded JWT
 */
function numericShcToJwt(rawSHC) {
  if (rawSHC.startsWith("shc:/")) {
    rawSHC = rawSHC.split("/")[1];
  }

  return rawSHC
    .match(/(..?)/g)
    .map((number) => String.fromCharCode(parseInt(number, 10) + 45))
    .join("");
}

/**
 * Decode the JWT header and return it as an object
 * @param {string} header Base64 encoded header
 * @return {object} The decoded header
 */
function parseJwtHeader(header: string) {
  const headerData = Buffer.from(header, "base64");
  return JSON.parse(headerData.toString());
}

/**
 * Decode and extract the JWT payload
 * @param {string} payload Base64 encoded + zlib compressed jwt payload
 * @return {object} The decoded payload
 */
function parseJwtPayload(payload: string) {
  const buffer = Buffer.from(payload, "base64");
  const payloadJson = pako.inflateRaw(buffer, { to: "string" });
  console.log(payloadJson);

  return JSON.parse(payloadJson);
}

/**
 * Verify the signature of the JWS with the given issuer
 * using the public key of the issuer.
 *
 * @param {string} jws JWS to verify
 * @param {string} issuer The expected issuer of the JWT
 * @return The verification result
 */
async function verifySignature(jws: string, issuer: string) {
  try {
    const key = await getKeys(issuer);
    const { payload, protectedHeader } = await compactVerify(jws, key);
    return {
      trustable: true,
      verifiedBy: protectedHeader.kid,
      origin: issuer,
    };
  } catch (err) {
    console.log(err.message);
    return {
      trustable: false,
    };
  }
}

/**
 * Get the public keys of the given issuer.
 * We try to get the keys from the cache  first,
 * if not found, we fetch them from the issuer.
 *
 * @param {string} issuer Issuer of the JWT to verify
 * @return {Promise<jose.JWK.Key | jose.JWK.KeyStore>} Key or keystore from the issuer
 */
async function getKeys(issuer) {
  // Fetch keys from the issuer if available
  const response = await axios.get(`${issuer}/.well-known/jwks.json`);
  const { keys } = response.data;
  return importJWK(keys[0]);
}
