import { writable, type Writable } from "svelte/store";

export type AlertColor = "red" | "yellow" | "green" | "purple" | "blue" | "light" | "dark" | "primary" | "none" | undefined;

export const alerts: Writable<{ message: string, timeoutId: NodeJS.Timeout, visible: Writable<boolean>, color: AlertColor }[]> = writable([]);