import type { DataConnection, Peer } from 'peerjs';
import { addConnection, removeConnection } from '../peerConnection';
import { handleRouter } from '../peerRouter';

export class PeerEvents {
    protected conn: DataConnection;
    private peer: Peer;

    constructor(conn: DataConnection) {
        this.conn = conn;
        this.peer = conn.provider;
    }

    public setConnectionEvents(): void {
        this.conn.on('open', () => this.open());
        this.conn.on('data', (data: any) => this.data(data));
        this.conn.on('close', () => this.close());
        this.conn.on('error', function (err) {
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

    protected reconnect(): void {
        this.conn = this.peer.connect(this.conn.peer);
        this.setConnectionEvents();
    }
}
