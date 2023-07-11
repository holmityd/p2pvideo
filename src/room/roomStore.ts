import { writable, type Writable } from "svelte/store";

export const roomKeyStore: Writable<string | undefined> = writable();
export const ownerStore = writable(true);
export const hostAlreadyConnectedStore = writable(false); 