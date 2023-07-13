import { get } from "svelte/store";
import { controlsVisibleStore, videoPausedStore } from "./playerStore";
import { ownerStore } from "../room/roomStore";
import { sendToAllPeers } from "../peer/peerService";
import { alertAdd } from "../alert/alertService";

export function togglePlay(video: HTMLVideoElement): void {
    if (!get(ownerStore)) return;
    if (video.paused)
        video.play().catch(() => {
            alertAdd('Video element has no supported sources');
        });
    else
        video.pause();
    sendToAllPeers({
        action: video.paused ? 'pause_video' : 'play_video',
        data: video.currentTime
    });
}

export function setVideoTime(video: HTMLVideoElement, time: number): void {
    if (!get(ownerStore)) return;
    video.currentTime = time;
    sendToAllPeers({
        action: 'time_video',
        data: time
    });
}

export function formatTime(timeInSeconds: number): string {
    if (Number.isNaN(timeInSeconds)) return '';
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
    }, 3000);
}

export function manageEventListeners(element: HTMLElement | Document, events: string[], callback: EventListener, add: boolean) {
    events.forEach(event => {
        if (add) {
            element.addEventListener(event, callback);
        } else {
            element.removeEventListener(event, callback);
        }
    });
}

let previousVolumeLevel = 100;
export function toggleMute(video: HTMLVideoElement): void {
    if (!video.volume) {
        video.volume = previousVolumeLevel;
    } else {
        previousVolumeLevel = video.volume;
        video.volume = 0;
    }
}