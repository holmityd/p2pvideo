import { writable } from 'svelte/store';

export const peersStore = writable([] as string[]);
export const userIdStore = writable('');