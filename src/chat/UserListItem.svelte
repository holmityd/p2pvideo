<script lang="ts">
	import { Icon, VideoCamera } from 'svelte-hero-icons';
	import { roomKeyStore } from '../room/roomStore';

	export let name: string;
</script>

<li
	class="flex items-center gap-1 whitespace-nowrap text-ellipsis overflow-hidden text-white mb-1 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-2 rounded-md"
>
	{#if $roomKeyStore == name}
		<Icon src={VideoCamera} size="10" class="bg-red-600 p-1 rounded box-content" />
	{/if}
	{name}
</li>
