<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { formatTime, setVideoTime } from '../playerService';
	import { VIDEO_TIME } from '../../room/localStorageKeys';

	// Props
	export let video: HTMLVideoElement;
	export let canControl: boolean;

	let progressBarElement: HTMLElement;

	// progress
	let progress = 0;
	function updateProgress(): void {
		if (!video.paused) {
			callMeEvery5SecondsOnly(() => {
				localStorage.setItem(VIDEO_TIME, String(video.currentTime));
			});
		}
		progress = (video.currentTime / video.duration) * 100;
	}
	function createCooldownFunction(delay: number) {
		let inProgress = false;
		return function (fun: Function) {
			if (inProgress) return;
			inProgress = true;
			setTimeout(() => {
				fun();
				inProgress = false;
			}, delay);
		};
	}
	const callMeEvery5SecondsOnly = createCooldownFunction(5000);

	// buffer progress
	let bufferProgress = 0;
	function updateBufferProgress(): void {
		const { length } = video.buffered;
		const { currentTime } = video;
		for (let i = 0; i < length; i++) {
			if (video.buffered.start(i) <= currentTime && currentTime <= video.buffered.end(i)) {
				bufferProgress = (video.buffered.end(i) / video.duration) * 100;
				break;
			}
		}
	}

	// Changing progress
	let isDragging = false;
	function setProgress(event: MouseEvent): void {
		if (!canControl) return;
		const rect = progressBarElement.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const clickedValue = (x * video.duration) / rect.width;
		setVideoTime(video, clickedValue);
	}
	function mouseDown(event: MouseEvent): void {
		isDragging = true;
		setProgress(event);
	}
	function mouseUp(): void {
		isDragging = false;
	}
	function mouseMove(event: MouseEvent): void {
		if (isDragging) {
			setProgress(event);
		}
	}

	// Timeline tooltip
	let hoverDuration: string | undefined;
	let hoverProgress: number = 0;
	function mouseHover(event: MouseEvent): void {
		const { left, width } = progressBarElement.getBoundingClientRect();
		const x = event.clientX - left;
		hoverDuration = formatTime((x / width) * video.duration);
		hoverProgress = (x * 100) / width;
	}
	function mouseOut(): void {
		hoverDuration = undefined;
		hoverProgress = 0;
	}

	// Lifecycle hooks
	onMount(() => {
		video.addEventListener('timeupdate', updateProgress);
		video.addEventListener('progress', updateBufferProgress);
		progressBarElement.addEventListener('mousedown', mouseDown);
		progressBarElement.addEventListener('mouseup', mouseUp);
		progressBarElement.addEventListener('mousemove', mouseMove);
		progressBarElement.addEventListener('mousemove', mouseHover);
		progressBarElement.addEventListener('mouseout', mouseOut);
	});
	onDestroy(() => {
		if (video) {
			video.removeEventListener('timeupdate', updateProgress);
			video.removeEventListener('progress', updateBufferProgress);
		}
		if (progressBarElement) {
			progressBarElement.removeEventListener('mousedown', mouseDown);
			progressBarElement.removeEventListener('mouseup', mouseUp);
			progressBarElement.removeEventListener('mousemove', mouseMove);
			progressBarElement.removeEventListener('mousemove', mouseHover);
			progressBarElement.removeEventListener('mouseout', mouseOut);
		}
	});
</script>

<div
	class="h-full relative group bg-gray-700 outline-none {canControl
		? 'cursor-pointer'
		: 'cursor-default'}"
	bind:this={progressBarElement}
>
	<span class="absolute bottom-0 left-0 w-full h-2.5" />
	<div class="pointer-events-none">
		<div class="absolute h-full bg-gray-500/50" style="width: {bufferProgress}%;" />
		<div class="absolute h-full bg-slate-100/25" style="width: {hoverProgress}%;" />
		<div class="absolute h-full bg-green-500" style="width: {progress}%;" />
	</div>
	{#if hoverDuration}
		<div
			class="absolute mb-2 bottom-full -translate-x-1/2
			bg-gray-800 shadow text-xs text-white px-2 py-1 rounded"
			style="left: {hoverProgress}%;"
		>
			{hoverDuration}
		</div>
	{/if}
</div>
