<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { formatTime } from '../playerService';

	// Props
	export let video: HTMLVideoElement;

	// Time update
	let currentTime = 0;
	let duration = 0;
	function updateTimeline(): void {
		currentTime = video.currentTime;
		duration = video.duration;
	}

	// Lifecycle hooks
	onMount(() => {
		updateTimeline();
		video.addEventListener('loadeddata', updateTimeline);
		video.addEventListener('timeupdate', updateTimeline);
	});
	onDestroy(() => {
		video.removeEventListener('loadeddata', updateTimeline);
		video.removeEventListener('timeupdate', updateTimeline);
	});
</script>

<div class="flex text-xs space-x-2 items-center text-white">
	<span>{formatTime(currentTime)}</span>
	<span>/</span>
	<span>{formatTime(duration)}</span>
</div>
