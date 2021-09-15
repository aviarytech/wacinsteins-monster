import { writable } from "svelte/store";

export const mobileSidebarClose = writable(true);

//INFO: more in-depth usage could use a stack data structure implementation
export const slideOverContent = writable(null);
export const slidePreviewOverContent = writable(null);
