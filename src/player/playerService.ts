import { get } from "svelte/store";
import { controlsVisibleStore, videoPausedStore } from "./playerStore";
import { ownerStore } from "../room/roomStore";
import { sendToAllPeers } from "../peer/peerService";

export function togglePlay(video: HTMLVideoElement, canControl: boolean): void {
    if (!canControl) return;
    if (video.paused)
        video.play();
    else
        video.pause();
    if (ownerStore) {
        sendToAllPeers({
            action: video.paused ? 'pause_video' : 'play_video',
            data: video.currentTime
        });
    }
}

export function setVideoTime(video: HTMLVideoElement, time: number): void {
    video.currentTime = time;
    if (ownerStore) {
        sendToAllPeers({
            action: 'time_video',
            data: time
        });
    }
}

export function formatTime(timeInSeconds: number): string {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    return `${hours > 0 ? hours + ':' : ''}${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

let controlHideTimeout: NodeJS.Timeout;
export function controlDelayedHide(): void {
    clearTimeout(controlHideTimeout);
    controlsVisibleStore.set(true);
    controlHideTimeout = setTimeout(() => {
        if (!get(videoPausedStore)) controlsVisibleStore.set(false);
    }, 4000);
}