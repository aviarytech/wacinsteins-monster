import { VaccinationCertificateInterface, VaccineInterface, VaccineRecipientInterface } from 'src/interfaces';
import { Writable, writable } from 'svelte/store';

export const vaccinationCertificateStore:Writable<VaccinationCertificateInterface> = writable({
  description:'',
  identifier: '',
  name: '',
  image: ''
})

export const vaccineRecipientStore:Writable<VaccineRecipientInterface> = writable({
  birthDate: new Date(),
  familyName: '',
  gender: '',
  givenName: ''
});

export const vaccineStore:Writable<VaccineInterface> = writable({
  atcCode: '',
  disease: '',
  event: ''
});

