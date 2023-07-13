import { writable, type Writable } from "svelte/store";

export const alerts: Writable<{ message: string, timeoutId: NodeJS.Timeout }[]> = writable([]);