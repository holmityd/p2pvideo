import { PeerEvents } from "./peerEvents";

export class UserEvents extends PeerEvents {
    private reconnectInterval?: NodeJS.Timeout;

    protected open(): void {
        clearInterval(this.reconnectInterval);
        super.open();
    }

    protected close(): void {
        super.close();
        this.reconnectInterval = setInterval(() => {
            this.reconnect();
        }, 1000);
    }
}