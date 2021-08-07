import { Writable } from "svelte/store";

export interface routeHooks {
  routeName: string | HTMLElement;
  routeUrl: string;
  heroIcon?: string;
}

export interface VaccinationCertificateInterface {
  description: string;
  identifier: string;
  name: string;
  image: string;
}
export interface VaccineRecipientInterface {
  birthDate: Date;
  familyName: string;
  gender: string;//maybe I should do an enum
  givenName: string;
}
export interface VaccineInterface {
  atcCode: string | number;
  disease: string;
  event: string;
}
export interface SchemaSelect {
  id:number;
  schemaStore:Writable<any>;
  schemaInterface:string;
}
