<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	let url: string = '';

	function send(): void {
		let src = url.trim();
		if (!src) return;

		src = src.split('.mp4')[0] + '.mp4';
		dispatch('urlUpdated', src);
		url = '';
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			send();
		}
	}
</script>

<div class="relative flex item-center overflow-hidden p-4">
	<input
		bind:value={url}
		on:keydown={handleKeyPress}
		class="flex-grow
            p-2 border-2 rounded focus:outline-none
            text-white bg-gray-950 border-black focus:border-green-500"
		placeholder="Video link"
	/>
	<button
		on:click={send}
		class="absolute top-1/2 -translate-y-1/2
            py-1 px-2 rounded-sm outline-none
            text-white bg-green-500 hover:bg-green-600
            transition-all duration-200
            {url ? 'right-2' : '-right-14'}"
	>
		Send
	</button>
</div>
