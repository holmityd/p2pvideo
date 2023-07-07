import { roomKeyStore, ownerStore } from './roomStore';
import { get } from 'svelte/store';
import { secret, getName } from '../peer/peerName';
import type { Peer } from 'peerjs';
import { initializePeer } from '../peer/peerService';

export function initPeer() {
    import('peerjs').then(({ Peer }) => {
        initializePeer(Peer);
    });
}

export function initializeRoom(peer: Peer, id: string): void {
    const room = get(roomKeyStore);

    if (room && secret + room !== id) return;
    ownerStore.set(true);
    if (!room) {
        const pathParts = window.location.pathname.split('/');
        pathParts[pathParts.length - 1] = getName(id);
        history.pushState({}, '', pathParts.join('/'));
    }
}