import { get } from 'svelte/store';
import { sendToOnePeer } from '../peerService';
import { peersStore } from '../peerStore';
import { PeerEvents } from './peerEvents';
import { getName } from '../peerName';
import { videoElmStore, videoSourceStore } from '../../video/videoStore';

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

        // // play if video playing

        // if (videoElm && !videoElm.paused) {
        //     sendToOnePeer(this.conn, {
        //         action: 'play_video',
        //         data: videoElm.currentTime
        //     });
        // }

        super.open();
    }

    protected data(data: string): void {
        super.data(data);
    }

    protected close(): void {
        super.close();
    }
}
