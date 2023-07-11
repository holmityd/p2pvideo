<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import IconButton from './IconButton.svelte';
	import { SpeakerWave, SpeakerXMark, type IconSource } from 'svelte-hero-icons';
	import { VIDEO_VOLUME } from '../../room/localStorageKeys';
	import { writable, type Writable } from 'svelte/store';

	// Props
	export let video: HTMLVideoElement;

	// Stores
	const tooltipText: Writable<string> = writable();
	const icon: Writable<IconSource> = writable();
	$: if (volumeLevel) {
		tooltipText.set('Mute');
		icon.set(SpeakerWave);
	} else {
		tooltipText.set('Unmute');
		icon.set(SpeakerXMark);
	}

	// Mute button
	let previousVolumeLevel = 100;
	function onClick(): void {
		if (!volumeLevel) {
			volumeLevel = previousVolumeLevel;
		} else {
			previousVolumeLevel = volumeLevel;
			volumeLevel = 0;
		}
		applyVolumeToVideo();
	}

	// Volume slider
	let volumeLevel = 100;
	function handleVolumeChange(event: Event): void {
		const target = event.target as HTMLInputElement;
		volumeLevel = parseFloat(target.value);
		applyVolumeToVideo();
	}
	function applyVolumeToVideo(): void {
		video.volume = volumeLevel / 100;
		updateMuteStatusAndLocalStorage();
	}
	function syncVolumeWithVideo(): void {
		volumeLevel = video.volume * 100;
		updateMuteStatusAndLocalStorage();
	}

	// Events
	function updateMuteStatusAndLocalStorage() {
		video.muted = !!!video.volume;
		localStorage.setItem(VIDEO_VOLUME, String(volumeLevel));
	}

	// Lifecycle hooks
	onMount(() => {
		video.addEventListener('volumechange', syncVolumeWithVideo);
		const volumeFromLocalStorage = Number(localStorage.getItem(VIDEO_VOLUME));
		if (volumeFromLocalStorage != undefined) {
			volumeLevel = volumeFromLocalStorage;
			applyVolumeToVideo();
		}
	});
	onDestroy(() => {
		video.removeEventListener('volumechange', syncVolumeWithVideo);
	});
</script>

<div class="group flex">
	<IconButton {onClick} {icon} {tooltipText} />
	<div class="items-center w-0 group-hover:w-24 transition-width duration-100 relative flex">
		<div class="mx-2 w-full h-1 rounded-sm overflow-hidden bg-gray-700">
			<input
				type="range"
				min="0"
				max="100"
				bind:value={volumeLevel}
				on:input={handleVolumeChange}
				class="w-full h-full opacity-0 appearance-none absolute top-0 left-0"
				tabindex="-1"
			/>
			<div
				class="h-full bg-green-500 transition-width duration-100"
				style={`width: ${volumeLevel}%`}
			/>
		</div>
	</div>
</div>
