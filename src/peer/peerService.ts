import type { DataConnection, Peer } from 'peerjs';
import { generateName, secret } from './peerName';
import { userIdStore, peersStore } from './peerStore';
import { get } from 'svelte/store';
import { HostEvents } from './classes/hostEvents';
import { UserEvents } from './classes/userEvents';
import { connections } from './peerConnection';
import { initializeRoom } from '../room/roomService';
import type { RouterData } from './dto/routerDto';
import { dev } from '$app/environment';
interface PeerError extends Error {
    type?: string;
}

let peer: Peer;

export function initializePeer(PeerConstructor: typeof Peer): void {
    const myIdLs = dev ? generateName() : localStorage.getItem('id');
    createPeer(PeerConstructor, myIdLs ? myIdLs : generateName());
}

function createPeer(PeerConstructor: typeof Peer, storageId?: string): void {
    if (!storageId)
        storageId = generateName();
    peer = new PeerConstructor(storageId);

    peer.on('open', (id) => {
        localStorage.setItem('id', id);
        userIdStore.set(id);
        initializeRoom(peer, id);
    });

    peer.on('connection', (conn) => {
        new HostEvents(conn);
    });

    peer.on('error', (error) => {
        const err = error as PeerError;
        // console.dir(err);
        switch (err.type) {
            case 'peer-unavailable':
                console.warn('peer-unavailable');
                break;
            case 'unavailable-id':
                peer.destroy();
                createPeer(PeerConstructor);
                break;
            default:
                console.warn(err);
        }
    });
}

export function connectToHostPeer(room: string | undefined): void {
    if (!room) return;
    const conn = peer.connect(secret + room);
    new UserEvents(conn);
}


export function sendToAllPeers(message: RouterData): void {
    connections.forEach((conn) => {
        conn.send(JSON.stringify(message));
    });
}

export function sendToOnePeer(conn: DataConnection, message: RouterData): void {
    conn.send(JSON.stringify(message));
}

export function addPeerToList(peer: string): boolean {
    const index = get(peersStore).indexOf(peer);
    if (index !== -1) return false;

    peersStore.update(n => {
        n.push(peer)
        return n;
    });

    return true;
}

export function removePeerFromList(peer: string): boolean {
    const index = get(peersStore).indexOf(peer);
    if (index === -1) return false;

    peersStore.update(n => {
        n.splice(index, 1);
        return n;
    });
    return true;
}