import type { Writable } from "svelte/store";
import { writable } from "svelte/store";
import websocketStore from "svelte-websocket-store";
//export const msgUSerBackend: Writable<Object[]> = writable(null)
export const selectedUser: Writable<string> = writable(null)

export const msgUSerBackend = websocketStore("wss://localhost:3100");

