<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	export let videoContainer: HTMLElement;
	import { ArrowsPointingOut, ArrowsPointingIn } from 'svelte-hero-icons';
	import IconButton from './IconButton.svelte';
	import { writable } from 'svelte/store';

	// click
	function toggleFullscreen(): void {
		if (!document.fullscreenElement) {
			if (videoContainer.requestFullscreen) {
				videoContainer.requestFullscreen();
			} else if ((videoContainer as any).msRequestFullscreen) {
				// IE/Edge
				(videoContainer as any).msRequestFullscreen();
			} else if ((videoContainer as any).mozRequestFullScreen) {
				// Firefox
				(videoContainer as any).mozRequestFullScreen();
			} else if ((videoContainer as any).webkitRequestFullscreen) {
				// Chrome, Safari and Opera
				(videoContainer as any).webkitRequestFullscreen();
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if ((document as any).msExitFullscreen) {
				// IE/Edge
				(document as any).msExitFullscreen();
			} else if ((document as any).mozCancelFullScreen) {
				// Firefox
				(document as any).mozCancelFullScreen();
			} else if ((document as any).webkitExitFullscreen) {
				// Chrome, Safari and Opera
				(document as any).webkitExitFullscreen();
			}
		}
	}

	// detect fullscreen
	let fullscreenMode = false;
	function updateFullscreenText() {
		fullscreenMode = !!document.fullscreenElement;
	}
	onMount(() => {
		document.addEventListener('fullscreenchange', updateFullscreenText);
		document.addEventListener('webkitfullscreenchange', updateFullscreenText);
		document.addEventListener('mozfullscreenchange', updateFullscreenText);
		document.addEventListener('MSFullscreenChange', updateFullscreenText);
	});
	onDestroy(() => {
		document.removeEventListener('fullscreenchange', updateFullscreenText);
		document.removeEventListener('webkitfullscreenchange', updateFullscreenText);
		document.removeEventListener('mozfullscreenchange', updateFullscreenText);
		document.removeEventListener('MSFullscreenChange', updateFullscreenText);
	});

	let tooltipText = writable('');
	$: tooltipText.set(fullscreenMode ? 'Exit Fullscreen' : 'Fullscreen');
</script>

<IconButton
	onClick={toggleFullscreen}
	icon={fullscreenMode ? ArrowsPointingIn : ArrowsPointingOut}
	{tooltipText}
/>
