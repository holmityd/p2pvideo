
import { get } from 'svelte/store';
import type { DataConnection } from 'peerjs';
import { addPeerToList, removePeerFromList, sendToAllPeers } from './peerService';
import { peersStore } from './peerStore';

export const connections: DataConnection[] = [];

export function addConnection(conn: DataConnection): void {
    if (!addPeerToList(conn.peer)) return;
    // send message to all connections about new peer - host
    sendToAllPeers({ action: 'user_connected', data: conn.peer });
    connections.push(conn);
}

export function removeConnection(conn: DataConnection): void {
    const index = get(peersStore).indexOf(conn.peer);
    if (!removePeerFromList(conn.peer)) return;
    // send message to all connections about remove peer - host
    sendToAllPeers({ action: 'user_disconnected', data: conn.peer });
    connections.splice(index, 1);
}
