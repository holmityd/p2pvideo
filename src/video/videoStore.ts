import { writable, type Writable } from 'svelte/store';

export const videoPausedStore = writable(true);
export const controlsVisibleStore = writable(true);
export const videoElmStore: Writable<HTMLVideoElement | undefined> = writable(undefined);
export const videoSourceStore = writable('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');