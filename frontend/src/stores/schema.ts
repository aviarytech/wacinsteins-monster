import {
  NameSchema,
  VaccinationCertificateInterface,
  VaccinationEvent,
  VaccineInterface,
  VaccineRecipientInterface,
} from "src/interfaces";
import { Readable, readable, Writable, writable } from "svelte/store";

export const vaccinationCertificateStore: Writable<VaccinationCertificateInterface> =
  writable({
    description: "",
    identifier: "",
    name: "",
    image: "",
  });

export const vaccineRecipientStore: Writable<VaccineRecipientInterface> =
  writable({
    birthDate: new Date(),
    familyName: "",
    gender: "",
    givenName: "",
  });

export const vaccineStore: Writable<VaccineInterface> = writable({
  atcCode: "",
  disease: "",
  event: "",
});

export const vaccinationEventStore:Writable<VaccinationEvent> = writable({
  administeringCentre:'',
  batchNumber: '',
  countryOfVaccination:'',
  dateOfVaccination: new Date(),
  healthProfessional: '',
  nextVaccinationDate: '',
  order:'',
  recipient:'',
  vaccine:''
})

export const vaccinationJsonLD = readable([
  {
    name:'',
    schema: '',
    store: undefined
  },
  {
    name: "VaccinationCertificate",
    schema: "https://w3id.org/vaccination#VaccinationCertificate",
    store: vaccinationCertificateStore
  },
  {
    name: "VaccinationEvent",
    schema: "https://w3id.org/vaccination#VaccinationEvent",
    store: vaccinationEventStore
  },
  {
    name: "VaccineRecipient",
    schema: "https://w3id.org/vaccination#VaccinationRecipient",
    store: vaccineRecipientStore
  },
  {
    name: "Vaccine",
    schema: "https://w3id.org/vaccination#Vaccine",
    store: vaccineStore
  }
]);
