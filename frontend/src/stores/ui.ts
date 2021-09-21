import { writable } from "svelte/store";

//INFO: more in-depth usage could use a stack data structure implementation
export const slideOverContent = writable(null);
export const slidePreviewOverContent = writable(null);
export const mblSidebar = writable(true);
