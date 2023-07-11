<script lang="ts">
	import IconButton from './IconButton.svelte';
	import { Pause, Play } from 'svelte-hero-icons';
	import { togglePlay } from '../playerService';
	import { videoPausedStore } from '../playerStore';
	import { writable } from 'svelte/store';

	export let video: HTMLVideoElement;
	export let canControl: boolean;

	let tooltipText = writable('');
	$: tooltipText.set($videoPausedStore ? 'Play' : 'Pause');
</script>

<IconButton
	onClick={() => togglePlay(video, canControl)}
	icon={$videoPausedStore ? Play : Pause}
	{tooltipText}
/>
