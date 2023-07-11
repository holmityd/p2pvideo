import { roomKeyStore, ownerStore } from './roomStore';
import { get } from 'svelte/store';
import { secret, getName } from '../peer/peerName';

export function initializeRoom(id: string): void {
    const room = get(roomKeyStore);

    if (room && secret + room !== id) {
        ownerStore.set(false);
        return;
    }
    ownerStore.set(true);
    if (!room) {
        const pathParts = window.location.pathname.split('/');
        pathParts[pathParts.length - 1] = getName(id);
        history.pushState({}, '', pathParts.join('/'));
    }
}