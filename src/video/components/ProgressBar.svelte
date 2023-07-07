<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { formatTime, setVideoTime } from '../videoService';

	export let video: HTMLVideoElement;
	export let canControl: boolean;

	let progressBar: HTMLElement;
	let isDragging = false;

	let progress = 0;
	let bufferProgress = 0;

	function updateProgress(): void {
		progress = (video.currentTime / video.duration) * 100;
	}

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

	function setProgress(event: MouseEvent): void {
		if (!canControl) return;
		const rect = progressBar.getBoundingClientRect();
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

	onMount(() => {
		video.addEventListener('timeupdate', updateProgress);
		video.addEventListener('progress', updateBufferProgress);
		progressBar.addEventListener('mousedown', mouseDown);
		progressBar.addEventListener('mouseup', mouseUp);
		progressBar.addEventListener('mousemove', mouseMove);
		progressBar.addEventListener('mousemove', mouseHover);
		progressBar.addEventListener('mouseout', mouseOut);
	});

	onDestroy(() => {
		if (video) {
			video.removeEventListener('timeupdate', updateProgress);
			video.removeEventListener('progress', updateBufferProgress);
		}

		if (progressBar) {
			progressBar.removeEventListener('mousedown', mouseDown);
			progressBar.removeEventListener('mouseup', mouseUp);
			progressBar.removeEventListener('mousemove', mouseMove);
			progressBar.removeEventListener('mousemove', mouseHover);
			progressBar.removeEventListener('mouseout', mouseOut);
		}
	});

	let hoverDuration: string | undefined;
	let hoverProgress: number = 0;
	function mouseHover(event: MouseEvent): void {
		const { left, width } = progressBar.getBoundingClientRect();
		const x = event.clientX - left;
		hoverDuration = formatTime((x / width) * video.duration);
		hoverProgress = (x * 100) / width;
	}
	function mouseOut(): void {
		hoverDuration = undefined;
		hoverProgress = 0;
	}
</script>

<div class="h-full relative cursor-pointer group bg-gray-700 outline-none" bind:this={progressBar}>
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
