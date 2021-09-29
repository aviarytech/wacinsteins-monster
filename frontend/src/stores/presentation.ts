import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export const presentations = writable([]);
export const scannedQRCode: Writable<string> = writable(null);
