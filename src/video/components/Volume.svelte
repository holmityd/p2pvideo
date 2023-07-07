<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import IconButton from './IconButton.svelte';
	import { SpeakerWave, SpeakerXMark } from 'svelte-hero-icons';
	import { writable } from 'svelte/store';
	import { VIDEO_MUTED } from '../../room/localStorageKeys';
	export let video: HTMLVideoElement;

	let volume = 100;

	const updateVolume = () => {
		video.volume = volume / 100;
	};

	onMount(() => {
		volume = video.volume * 100;
		video.addEventListener('volumechange', updateVolume);
		if (Boolean(Number(localStorage.getItem(VIDEO_MUTED)))) {
			video.muted = true;
			muted = true;
		}
	});

	onDestroy(() => {
		video.removeEventListener('volumechange', updateVolume);
	});

	const changeVolume = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (muted) muteToggle();
		volume = parseFloat(target.value);
		updateVolume();
	};

	let muted = false;
	const muteToggle = () => {
		video.muted = !video.muted;
		muted = video.muted;
		localStorage.setItem(VIDEO_MUTED, String(muted ? 1 : 0));
	};

	let tooltipText = writable('');
	$: tooltipText.set(volume != 0 && !muted ? 'Mute' : 'Unmute');
</script>

<div class="group flex">
	<IconButton
		onClick={muteToggle}
		icon={volume != 0 && !muted ? SpeakerWave : SpeakerXMark}
		{tooltipText}
	/>
	<div class="items-center w-0 group-hover:w-24 transition-width duration-100 relative flex">
		<div class="mx-2 w-full h-1 rounded-sm overflow-hidden bg-gray-700">
			<input
				type="range"
				min="0"
				max="100"
				bind:value={volume}
				on:input={changeVolume}
				class="w-full h-full opacity-0 appearance-none absolute top-0 left-0"
				tabindex="-1"
			/>
			<div
				class="h-full bg-green-500 transition-width duration-100"
				style={`width: ${!muted ? volume : 0}%`}
			/>
		</div>
	</div>
</div>
