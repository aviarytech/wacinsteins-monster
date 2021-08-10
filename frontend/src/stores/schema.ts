import {
  VaccinationCertificateInterface,
  VaccinationEvent,
  VaccineInterface,
  VaccineRecipientInterface,
} from "src/interfaces";
import { writable, Writable } from "svelte/store";

let vaccinationCertificateStore:VaccinationCertificateInterface ={
    description: false,
    identifier: false,
    name: false,
    image: false,
  };

let vaccineRecipientStore:VaccineRecipientInterface = {
    birthDate: false,
    familyName: false,
    gender: false,
    givenName: false,
  };

let vaccineStore:VaccineInterface = {
  atcCode: false,
  disease: false,
  event: false,
};

let vaccinationEventStore:VaccinationEvent ={
  administeringCentre:false,
  batchNumber: false,
  countryOfVaccination:false,
  dateOfVaccination: false,
  healthProfessional: false,
  nextVaccinationDate: false,
  order:false,
  recipient:false,
  vaccine:false
}

export const vaccinationJsonLD:Writable<any> = writable([
  {
    name:'',
    schema: '',
    fields: undefined
  },
  {
    name: "VaccinationCertificate",
    schema: "https://w3id.org/vaccination#VaccinationCertificate",
    fields: vaccinationCertificateStore
  },
  {
    name: "VaccinationEvent",
    schema: "https://w3id.org/vaccination#VaccinationEvent",
    fields: vaccinationEventStore
  },
  {
    name: "VaccineRecipient",
    schema: "https://w3id.org/vaccination#VaccinationRecipient",
    fields: vaccineRecipientStore
  },
  {
    name: "Vaccine",
    schema: "https://w3id.org/vaccination#Vaccine",
    fields: vaccineStore
  }
]);
