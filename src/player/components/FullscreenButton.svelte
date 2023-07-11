<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { ArrowsPointingOut, ArrowsPointingIn, type IconSource } from 'svelte-hero-icons';
	import IconButton from './IconButton.svelte';
	import { writable, type Writable } from 'svelte/store';

	// Props
	export let videoContainer: HTMLElement;

	// Store
	const tooltipText: Writable<string> = writable();
	const icon: Writable<IconSource> = writable();
	$: if (fullscreenMode) {
		tooltipText.set('Exit Fullscreen');
		icon.set(ArrowsPointingIn);
	} else {
		tooltipText.set('Fullscreen');
		icon.set(ArrowsPointingOut);
	}

	let fullscreenMode = false;
	function updateFullscreenMode() {
		fullscreenMode = !!document.fullscreenElement;
	}

	// click
	function onClick(): void {
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

	// Lifecycle hooks
	onMount(() => {
		document.addEventListener('fullscreenchange', updateFullscreenMode);
		document.addEventListener('webkitfullscreenchange', updateFullscreenMode);
		document.addEventListener('mozfullscreenchange', updateFullscreenMode);
		document.addEventListener('MSFullscreenChange', updateFullscreenMode);
	});
	onDestroy(() => {
		document.removeEventListener('fullscreenchange', updateFullscreenMode);
		document.removeEventListener('webkitfullscreenchange', updateFullscreenMode);
		document.removeEventListener('mozfullscreenchange', updateFullscreenMode);
		document.removeEventListener('MSFullscreenChange', updateFullscreenMode);
	});
</script>

<IconButton {onClick} {icon} {tooltipText} />
