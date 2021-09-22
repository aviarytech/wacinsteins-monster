import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export const presentations = writable([]);
//TODO: move to ui as this key is transient
export const qrCodeIdValue: Writable<string> = writable(null)
export const scannedQRCode: Writable<string> = writable(null)

