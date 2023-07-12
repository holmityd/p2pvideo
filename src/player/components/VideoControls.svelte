<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { controlsVisibleStore } from '../playerStore';

	import PlayButton from './PlayButton.svelte';
	import Volume from './Volume.svelte';
	import Timeline from './Timeline.svelte';
	import FullscreenButton from './FullscreenButton.svelte';
	import ProgressBar from './ProgressBar.svelte';
	import { togglePlay, setVideoTime, controlDelayedHide } from '../playerService';
	import Loading from './Loading.svelte';

	// Props
	export let canControl: boolean = false;
	export let video: HTMLVideoElement;
	export let videoContainer: HTMLElement;

	function handleKeyPress(event: KeyboardEvent) {
		const activeElement = document.activeElement;
		const isInputFocused = activeElement && activeElement.tagName === 'INPUT';
		const keys = [' ', 'k', 'j', 'k', 'l', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
		if (!isInputFocused && keys.indexOf(event.key) != -1) {
			event.preventDefault();
			controlDelayedHide();
			switch (event.key) {
				case ' ':
				case 'k':
					togglePlay(video);
					break;
				case 'j':
					jump(-10);
					break;
				case 'l':
					jump(+10);
					break;
				case 'ArrowLeft':
					jump(-5);
					break;
				case 'ArrowRight':
					jump(+5);
					break;
				case 'ArrowUp':
					adjustVolume(+0.1);
					break;
				case 'ArrowDown':
					adjustVolume(-0.1);
					break;
			}
		}
	}

	function jump(seconds: number) {
		const newTime = clamp(video.currentTime + seconds, 0, video.duration);
		setVideoTime(video, newTime >= 0 ? newTime : 0);
	}

	function adjustVolume(amount: number) {
		const newVolume = clamp(video.volume + amount, 0, 1);
		video.volume = newVolume;
	}

	function clamp(value: number, min: number, max: number) {
		return Math.min(Math.max(value, min), max);
	}

	// Lifecycle hooks
	onMount(() => {
		document.addEventListener('keydown', handleKeyPress);
	});
	onDestroy(() => {
		document.removeEventListener('keydown', handleKeyPress);
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="absolute w-full h-full outline-none {$controlsVisibleStore
		? 'cursor-default'
		: 'cursor-none'}"
	on:click={() => togglePlay(video)}
/>

<Loading {video} />

<div
	class="absolute left-0 w-full pt-0 pb-1 px-2 flex backdrop-blur bg-gray-700/50 {$controlsVisibleStore
		? 'bottom-0'
		: '-bottom-11'} transition-bottom duration-200"
>
	{#if canControl}
		<PlayButton {video} />
	{/if}
	<Volume {video} />
	<Timeline {video} />
	<span class="grow" />
	<FullscreenButton {videoContainer} />

	<div class="absolute bottom-0 left-0 w-full h-1 hover:h-1.5 transition-height duration-100">
		<ProgressBar {video} {canControl} />
	</div>
</div>
