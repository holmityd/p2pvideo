import { alerts } from "./alertStore";

const alertRemoveTimer = 5000;

export function alertAdd(message: string): void {
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
            n.push({ message, timeoutId });
        }
        return n;
    });
};

export function alertDelete(message: string): void {
    alerts.update(n => {
        let index = n.findIndex(i => i.message === message);
        clearTimeout(n[index].timeoutId);
        n.splice(index, 1);
        return n;
    });
}