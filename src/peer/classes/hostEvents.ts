import { get } from 'svelte/store';
import { sendToOnePeer } from '../peerService';
import { peersStore } from '../peerStore';
import { PeerEvents } from './peerEvents';
import { getName } from '../peerName';
import { videoElmStore } from '../../video/videoStore';

export class HostEvents extends PeerEvents {

    protected open(): void {
        // list of connected users
        sendToOnePeer(this.conn, {
            action: 'host_users',
            data: get(peersStore)
        });

        // play if video playing
        const videoElm = get(videoElmStore);
        if (videoElm && !videoElm.paused) {
            sendToOnePeer(this.conn, {
                action: 'play_video',
                data: videoElm.currentTime
            });
        }

        super.open();
    }

    protected data(data: string): void {
        super.data(data);
    }

    protected close(): void {
        super.close();
    }
}
