import { Writable } from "svelte/store";

export interface routeHooks {
  routeName: string | HTMLElement;
  routeUrl: string;
  heroIcon?: string;
}
//vaccine json-ld
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


export interface VaccinationEvent {
  administeringCentre:string;
  batchNumber: string;
  countryOfVaccination:string;
  dateOfVaccination: Date;
  healthProfessional: string;
  nextVaccinationDate: string;
  order:string;
  recipient:string;
  vaccine:string;
}

export interface NameSchema {
  name: string;
  schema:string;
  store:Writable<any>|undefined;
}


