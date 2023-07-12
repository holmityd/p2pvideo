<script lang="ts">
	import IconButton from './IconButton.svelte';
	import { Pause, Play, type IconSource } from 'svelte-hero-icons';
	import { togglePlay } from '../playerService';
	import { videoPausedStore } from '../playerStore';
	import { writable, type Writable } from 'svelte/store';

	// Props
	export let video: HTMLVideoElement;

	// Stores
	const tooltipText: Writable<string> = writable();
	const icon: Writable<IconSource> = writable();
	$: if ($videoPausedStore) {
		tooltipText.set('Play');
		icon.set(Play);
	} else {
		tooltipText.set('Pause');
		icon.set(Pause);
	}

	// Events
	function onClick() {
		togglePlay(video);
	}
</script>

<IconButton {onClick} {icon} {tooltipText} />
