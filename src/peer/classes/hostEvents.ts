import { get } from 'svelte/store';
import { sendToOnePeer } from '../peerService';
import { peersStore } from '../peerStore';
import { PeerEvents } from './peerEvents';
import { videoElmStore, videoSourceStore } from '../../player/playerStore';

export class HostEvents extends PeerEvents {
    protected open(): void {
        // list of connected users
        sendToOnePeer(this.conn, {
            action: 'host_users',
            data: get(peersStore)
        });

        // change source
        const videoElm = get(videoElmStore);
        sendToOnePeer(this.conn, {
            action: 'change_src',
            data: {
                src: get(videoSourceStore),
                timeline: videoElm?.currentTime,
                playing: videoElm && !videoElm.paused
            }
        });

        super.open();
    }
}
