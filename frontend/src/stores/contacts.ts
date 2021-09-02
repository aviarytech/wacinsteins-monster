import type { Writable } from "svelte/store";
import { writable } from "svelte/store";

const placeholderData = ['web']
export const contactDropDownOptions:Writable<string[]> = writable(placeholderData)
export const availableContacts:Writable<string[]> = writable([])
