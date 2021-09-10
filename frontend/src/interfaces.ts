import type { Writable } from "svelte/store";

export interface routeHooks {
  routeName: string;
  routeUrl: string;
  heroIcon?: string;
}

export interface NameSchema {
  name: string;
  schema: string;
  store: Writable<any> | undefined;
}
// api
export interface PostPresentationPayload {
  schema: string;
  paths: string[];
  frame: object;
}

export interface Credential {
  "@id": string;
  data: {
    id: string;
    issuer: { id: string };
    issuanceDate: string;
    name: string;
  };
}
