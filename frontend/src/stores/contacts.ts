import { Writable, writable } from "svelte/store";

const placeholderData = ['','Web']
export const contactDropDownOptions:Writable<string[]> = writable(placeholderData)
