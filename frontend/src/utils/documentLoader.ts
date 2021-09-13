import * as cre from "@transmute/credentials-context";
import * as sec from "@transmute/security-context";
import * as did from "@transmute/did-context";
import vax from "../contexts/vax-v1.json";

const contexts = {
  // did contexts
  [did.constants.DID_CONTEXT_V1_URL]: did.contexts.get(
    did.constants.DID_CONTEXT_V1_URL
  ),

  // credential contexts
  [cre.constants.CREDENTIALS_CONTEXT_V1_URL]: cre.contexts.get(
    cre.constants.CREDENTIALS_CONTEXT_V1_URL
  ),

  // credential suites
  [sec.constants.JSON_WEB_SIGNATURE_2020_V1_URL]: sec.contexts.get(
    sec.constants.JSON_WEB_SIGNATURE_2020_V1_URL
  ),

  [sec.constants.BLS12381_2020_V1_URL]: sec.contexts.get(
    sec.constants.BLS12381_2020_V1_URL
  ),

  // security contexts... these are required by mattr suite... but should not be
  "https://w3id.org/security/bbs/v1": sec.contexts.get(
    sec.constants.BLS12381_2020_V1_URL
  ),
  "https://w3id.org/security/v2": sec.contexts.get(
    sec.constants.SECURITY_CONTEXT_V2_URL
  ),
  "https://w3id.org/security/v1": sec.contexts.get(
    sec.constants.SECURITY_CONTEXT_V1_URL
  ),

  //credential vocabularies
  "https://w3id.org/vaccination/v1": vax,
};

const documentResolver = async (iri: string) => {
  return undefined;
};

const contextResolver = async (iri: string) => {
  if (contexts[iri]) {
    return { contextUrl: null, document: contexts[iri], documentUrl: iri };
  }
  return undefined;
};

export const documentLoader = async (iri: string) => {
  const context = await contextResolver(iri);
  if (context) {
    return context;
  }

  const resolution = await documentResolver(iri);

  if (resolution) {
    return resolution;
  }

  const message = "Unsupported iri: " + iri;
  console.error(message);
  throw new Error(message);
};
