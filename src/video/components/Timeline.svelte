<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { formatTime } from '../videoService';
	export let video: HTMLVideoElement;

	let currentTime = 0;
	let duration = 0;

	onMount(() => {
		video?.addEventListener('timeupdate', updateTimeline);
	});

	onDestroy(() => {
		video?.removeEventListener('timeupdate', updateTimeline);
	});

	function updateTimeline(): void {
		currentTime = video.currentTime;
		duration = video.duration;
	}
</script>

<div class="flex text-xs space-x-2 items-center text-white">
	<span>{formatTime(currentTime)}</span>
	<span>/</span>
	<span>{formatTime(duration)}</span>
</div>
