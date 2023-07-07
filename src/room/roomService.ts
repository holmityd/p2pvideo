import { roomKeyStore, ownerStore } from './roomStore';
import { get } from 'svelte/store';
import { secret, getName } from '../peer/peerName';
import type { Peer } from 'peerjs';
import { UserEvents } from '../peer/classes/userEvents';
import { initializePeer } from '../peer/peerService';

export function initPeer() {
    import('peerjs').then(({ Peer }) => {
        initializePeer(Peer);
    });
}

export function initializeRoom(peer: Peer, id: string): void {
    const room = get(roomKeyStore);

    if (room && secret + room !== id) {
        // Connect to host
        // new UserEvents(peer.connect(secret + room));
    } else {
        ownerStore.set(true);
        if (!room)
            history.pushState({}, '', '/' + getName(id)); // Change path
    }
}