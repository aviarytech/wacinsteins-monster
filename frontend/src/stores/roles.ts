import { writable } from "svelte/store";

export const roles = writable({
  subject: false,
  issuer: false,
  verifier: false,
  holder: false,
});
