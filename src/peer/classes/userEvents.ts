import type { DataConnection } from "peerjs";
import { PeerEvents } from "./peerEvents";

export class UserEvents extends PeerEvents {
    private reconnectInterval?: NodeJS.Timeout;

    constructor(conn: DataConnection, reconnectInterval?: NodeJS.Timeout) {
        super(conn);
        this.reconnectInterval = reconnectInterval;
    }

    protected open(): void {
        clearInterval(this.reconnectInterval);
        super.open();
    }

    protected close(): void {
        super.close();
        this.reconnectInterval = setInterval(() => {
            new UserEvents(this.reconnect(), this.reconnectInterval);
        }, 1000);
    }
}