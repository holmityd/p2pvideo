<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { controlsVisibleStore } from '../playerStore';

	import PlayButton from './PlayButton.svelte';
	import Volume from './Volume.svelte';
	import Timeline from './Timeline.svelte';
	import FullscreenButton from './FullscreenButton.svelte';
	import ProgressBar from './ProgressBar.svelte';
	import { togglePlay } from '../playerService';
	import Loading from './Loading.svelte';

	// Props
	export let canControl: boolean = false;
	export let video: HTMLVideoElement;
	export let videoContainer: HTMLElement;

	// Lifecycle hooks
	onMount(() => {});
	onDestroy(() => {});
</script>

<div
	class="absolute w-full h-full outline-none {$controlsVisibleStore
		? 'cursor-default'
		: 'cursor-none'}"
	on:click={() => togglePlay(video, canControl)}
	on:keypress={(event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			togglePlay(video, canControl);
		}
	}}
	role="button"
	tabindex="0"
/>

<Loading {video} />

<div
	class="absolute left-0 w-full pt-0 pb-1 px-2 flex backdrop-blur bg-gray-800/50 {$controlsVisibleStore
		? 'bottom-0'
		: '-bottom-11'} transition-bottom duration-200"
>
	{#if canControl}
		<PlayButton {video} {canControl} />
	{/if}
	<Volume {video} />
	<Timeline {video} />
	<span class="grow" />
	<FullscreenButton {videoContainer} />

	<div class="absolute bottom-0 left-0 w-full h-1 hover:h-1.5 transition-height duration-100">
		<ProgressBar {video} {canControl} />
	</div>
</div>
