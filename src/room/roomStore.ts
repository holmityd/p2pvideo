import { writable, type Writable } from "svelte/store";

export const roomKeyStore: Writable<string | undefined> = writable();
export const ownerStore = writable(false);
export const hostAlreadyConnectedStore = writable(false); 