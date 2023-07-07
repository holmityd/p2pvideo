import { get } from "svelte/store";
import { videoElmStore, videoSourceStore } from "../video/videoStore";
import type { RouterData } from "./dto/routerDto";
import { addPeerToList, removePeerFromList } from "./peerService";

export function handleRouter(routerData: RouterData): void {
    router_actions[routerData.action](routerData.data);
}
type RouterActions = {
    [key: string]: (data: any) => void;
};
const router_actions: RouterActions = {
    'host_users': (peerIds: string[]) => {
        peerIds.forEach(peerId => {
            addPeerToList(peerId);
        });
    },
    'user_connected': (peerId: string) => {
        addPeerToList(peerId);
    },
    'user_disconnected': (peerId: string) => {
        removePeerFromList(peerId);
    },
    'play_video': (timeline: number) => {
        const videoElm = get(videoElmStore);
        if (videoElm) {
            videoElm.currentTime = timeline;
            videoElm.play();
        }
    },
    'pause_video': _ => {
        get(videoElmStore)?.pause();
    },
    'time_video': (timeline: number) => {
        const videoElm = get(videoElmStore);
        if (videoElm)
            videoElm.currentTime = timeline;
    },
    'change_src': ({ src, timeline, playing }) => {
        videoSourceStore.set(src);
        const videoElm = get(videoElmStore);
        if (videoElm && timeline) {
            videoElm.addEventListener('loadeddata', () => {
                videoElm.currentTime = timeline;
                if (playing)
                    videoElm.play();
            });
        }
    }
}