import { persistable } from "../utils/persistable";
import { writable } from "svelte/store";

export const user = persistable("user", "loading");

// export const user = writable();
