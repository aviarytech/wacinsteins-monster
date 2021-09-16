import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export const presentations = writable([]);
export const qrCodeIdValue: Writable<string> = writable(null)
export const scannedQRCode: Writable<string> = writable(null)

