<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { formatTime, manageEventListeners } from '../playerService';

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
		manageEventListeners(video, ['loadeddata', 'timeupdate'], updateTimeline, true);
	});
	onDestroy(() => {
		manageEventListeners(video, ['loadeddata', 'timeupdate'], updateTimeline, false);
	});
</script>

<div class="flex text-xs space-x-2 items-center text-white">
	{#if duration}
		<span>{formatTime(currentTime)}</span>
		<span>/</span>
		<span>{formatTime(duration)}</span>
	{/if}
</div>
