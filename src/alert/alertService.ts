import { get, writable } from "svelte/store";
import { alerts, type AlertColor } from "./alertStore";

const alertRemoveTimer = 5000;

export function alertAdd(message: string, color: AlertColor = 'red'): void {
    alerts.update(n => {
        const existing = n.find(i => i.message === message);
        if (existing) {
            clearTimeout(existing.timeoutId);
            existing.timeoutId = setTimeout(() => {
                alertDelete(message);
            }, alertRemoveTimer);
        } else {
            const timeoutId = setTimeout(() => {
                alertDelete(message);
            }, alertRemoveTimer);
            n.push({ message, timeoutId, visible: writable(false), color });
        }
        return n;
    });
};

export function alertDelete(message: string): void {
    const $alerts = get(alerts);
    let index = $alerts.findIndex(i => i.message === message);
    $alerts[index].visible.set(false);
    setTimeout(() => {
        alerts.update(n => {
            let index = n.findIndex(i => i.message === message);
            clearTimeout(n[index].timeoutId);
            n.splice(index, 1);
            return n;
        });
    }, 500); // animation delay + 100
}