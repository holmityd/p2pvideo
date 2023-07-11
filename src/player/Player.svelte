<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { controlDelayedHide } from './playerService';
	import { videoElmStore, videoPausedStore } from './playerStore';
	import { VIDEO_TIME } from '../room/localStorageKeys';
	import VideoControls from './components/VideoControls.svelte';
	import PlayerSkeleton from './components/PlayerSkeleton.svelte';

	// Props
	export let src: string = '';
	export let subtitles: string = '';
	export let canControl: boolean = false;

	// Elements
	let videoContainer: HTMLElement;
	let video: HTMLVideoElement;
	let showSkeleton = true;

	$: if (src) {
		showSkeleton = true;
	}

	// Lifecycle hooks
	let videoPauseUnsubscribe = videoPausedStore.subscribe(() => controlDelayedHide());
	onMount(() => {
		videoElmStore.set(video);
		video.controls = false;
		showSkeleton = false;
		video.addEventListener('loadeddata', () => {
			showSkeleton = false;
			const savedVideoTime = Number(localStorage.getItem(VIDEO_TIME));
			if (savedVideoTime) video.currentTime = savedVideoTime;
		});
		video.addEventListener('play', () => videoPausedStore.set(false));
		video.addEventListener('pause', () => videoPausedStore.set(true));
	});
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
	<video bind:this={video} {src} class="w-full max-w-full h-full max-h-full">
		<track kind="captions" srclang="en" src={subtitles} label="English" default />
	</video>

	{#if showSkeleton}
		<PlayerSkeleton />
	{/if}

	{#if video}
		<VideoControls {video} {canControl} {videoContainer} />
	{/if}
</div>
