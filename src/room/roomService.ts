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
        if (!room) {
            let currentPath = window.location.pathname; // This will be something like '/page/oldId'
            let pathParts = currentPath.split('/'); // This will give ['','page','oldId']

            // Replace 'oldId' with the new id
            let name = getName(id);
            pathParts[pathParts.length - 1] = name;

            let newPath = pathParts.join('/'); // Reconstruct the path
            history.pushState({}, '', newPath);
        }
    }
}