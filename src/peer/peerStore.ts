import { writable, type Writable } from 'svelte/store';

export const peersStore = writable([] as string[]);
export const userIdStore = writable('');
export const hostAlreadyConnectedStore = writable(false); 