import type { DataConnection, Peer } from 'peerjs';
import { addConnection, removeConnection } from '../peerConnection';
import { handleRouter } from '../peerRouter';

export class PeerEvents {
    protected conn: DataConnection;
    private peer: Peer;

    constructor(conn: DataConnection) {
        this.conn = conn;
        this.peer = conn.provider;

        conn.on('open', () => this.open());
        conn.on('data', (data: any) => this.data(data));
        conn.on('close', () => this.close());
        conn.on('error', function (err) {
            console.warn('An error occurred: ' + err.message);
        });
    }

    protected open(): void {
        addConnection(this.conn);
    }

    protected data(data: string): void {
        handleRouter(JSON.parse(data));
    }

    protected close(): void {
        removeConnection(this.conn);
    }

    protected reconnect(): DataConnection {
        this.conn = this.peer.connect(this.conn.peer);
        return this.conn;
    }
}
