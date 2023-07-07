<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { controlDelayedHide, togglePlay } from './videoService';
	import { controlsVisibleStore, videoElmStore, videoPausedStore } from './videoStore';

	import PlayButton from './components/PlayButton.svelte';
	import Volume from './components/Volume.svelte';
	import Timeline from './components/Timeline.svelte';
	import FullscreenButton from './components/FullscreenButton.svelte';
	import ProgressBar from './components/ProgressBar.svelte';
	import Loading from './components/Loading.svelte';
	import { VIDEO_TIME } from '../room/localStorageKeys';

	export let src: string = '';
	export let canControl: boolean = false;

	let videoContainer: HTMLElement;
	let video: HTMLVideoElement;

	onMount(() => {
		videoElmStore.set(video);
		video.controls = false;
		video.addEventListener('loadeddata', () => {
			const videoTimeLS = Number(localStorage.getItem(VIDEO_TIME));
			if (videoTimeLS) video.currentTime = videoTimeLS;
		});
		video.addEventListener('play', () => videoPausedStore.set(false));
		video.addEventListener('pause', () => videoPausedStore.set(true));
	});

	let videoPauseUnsubscribe = videoPausedStore.subscribe((e) => controlDelayedHide());

	onDestroy(() => {
		videoPauseUnsubscribe();
	});
</script>

<div
	bind:this={videoContainer}
	class="relative flex h-full items-center box-border rounded-sm shadow-lg overflow-hidden select-none bg-black"
	on:mousemove={controlDelayedHide}
	role="application"
>
	<video bind:this={video} {src} class="w-full">
		<track kind="captions" srclang="en" label="English" />
	</video>

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

	{#if video}
		<Loading {video} />

		<!-- video controls here -->
		<div
			class="absolute left-0 w-full pt-0 pb-1 px-2 flex backdrop-blur bg-gray-800/50 {$controlsVisibleStore
				? 'bottom-0'
				: '-bottom-8'} transition-bottom duration-200"
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
	{/if}
</div>
