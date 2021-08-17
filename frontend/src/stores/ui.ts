import { writable } from "svelte/store";

export const profileDropMenu = writable(false);
export const mobileSidebarClose = writable(false);

//INFO: more in-depth usage could use a stack data structure implementation
export const slideOverContent = writable(null);
export const slidePreviewOverContent = writable(null);

