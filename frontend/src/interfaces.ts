import { Writable } from "svelte/store";

export interface routeHooks {
  routeName: string | HTMLElement;
  routeUrl: string;
  heroIcon?: string;
}
//vaccine json-ld
export interface VaccinationCertificateInterface {
  description: boolean;
  identifier: boolean;
  name: boolean;
  image: boolean;
}

export interface VaccineRecipientInterface {
  birthDate: Boolean;
  familyName: boolean;
  gender: boolean;//maybe I should do an enum
  givenName: boolean;
}

export interface VaccineInterface {
  atcCode: boolean;
  disease: boolean;
  event: boolean;
}


export interface VaccinationEvent {
  administeringCentre:boolean;
  batchNumber: boolean;
  countryOfVaccination:boolean;
  dateOfVaccination: boolean;
  healthProfessional: boolean;
  nextVaccinationDate: boolean;
  order:boolean;
  recipient:boolean;
  vaccine:boolean;
}

export interface NameSchema {
  name: string;
  schema:string;
  store:Writable<any>|undefined;
}


