import type { DataConnection, Peer } from 'peerjs';
import { generateName, secret } from './peerName';
import { userIdStore, peersStore } from './peerStore';
import { get } from 'svelte/store';
import { HostEvents } from './classes/hostEvents';
import { UserEvents } from './classes/userEvents';
import { connections } from './peerConnection';
import { initializeRoom } from '../room/roomService';
import type { RouterData } from './dto/routerDto';
import { roomKeyStore, hostAlreadyConnectedStore } from '../room/roomStore';
import { SESSION_ID } from '../room/localStorageKeys';
import { dev } from '$app/environment';

interface PeerError extends Error {
    type?: string;
}

let peer: Peer;

export function initializePeer(PeerConstructor: typeof Peer): void {
    // const myIdLs = localStorage.getItem(SESSION_ID);
    const myIdLs = dev ? generateName() : localStorage.getItem(SESSION_ID);
    createPeer(PeerConstructor, myIdLs ? myIdLs : generateName());
}

function createPeer(PeerConstructor: typeof Peer, storageId?: string): void {
    if (!storageId)
        storageId = generateName();
    peer = new PeerConstructor(storageId);

    peer.on('open', (id) => {
        localStorage.setItem(SESSION_ID, id);
        userIdStore.set(id);
        initializeRoom(id);
    });

    peer.on('connection', (conn) => {
        const hostEvents = new HostEvents(conn);
        hostEvents.setConnectionEvents();
    });

    peer.on('error', (error) => {
        const err = error as PeerError;
        switch (err.type) {
            case 'peer-unavailable':
                console.warn('peer-unavailable');
                break;
            case 'unavailable-id':
                const room = secret + get(roomKeyStore);
                if (storageId == room) {    // is host check
                    hostAlreadyConnectedStore.set(true);
                } else {
                    peer.destroy();
                    createPeer(PeerConstructor);
                }
                break;
            default:
                console.warn(err);
        }
    });
}

export function connectToHostPeer(room: string | undefined): void {
    if (!room) return;
    const conn = peer.connect(secret + room);
    const userEvents = new UserEvents(conn);
    userEvents.setConnectionEvents();
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