import type { Writable } from "svelte/store";
import { writable } from "svelte/store";

export const msgUSerBackend: Writable<Object[]> = writable(null)
export const selectedUser: Writable<string> = writable(null)
export const someoneIsTyping: Writable<string> = writable(null)
