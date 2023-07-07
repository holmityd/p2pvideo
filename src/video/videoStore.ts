import { writable, type Writable } from 'svelte/store';

export const videoPausedStore = writable(true);
export const controlsVisibleStore = writable(true);
export const videoElmStore: Writable<HTMLVideoElement | undefined> = writable(undefined);