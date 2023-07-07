<script lang="ts">
	import { onMount } from 'svelte';
	import { roomKeyStore, ownerStore } from './roomStore.js';
	import { connectToHostPeer, initializePeer } from '../peer/peerService.js';

	// components
	import Video from '../video/Video.svelte';
	import RoomControl from './components/RoomControl.svelte';
	import Chat from '../chat/Chat.svelte';

	// peer
	export let id: string | undefined = undefined;
	onMount(() => {
		roomKeyStore.set(id);
		import('peerjs').then(({ Peer }) => {
			initializePeer(Peer);
		});
	});

	// video
	let src: string =
		'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

	// room control
	let roomControlUrl: string = '';
	function handleUrlUpdated(event: CustomEvent) {
		roomControlUrl = event.detail; // the updated url is available in the event detail
		console.log('URL Updated:', roomControlUrl);
		src = roomControlUrl;
	}

	let joined = false;
	function join() {
		joined = true;
		connectToHostPeer($roomKeyStore);
	}
</script>

<div class="flex flex-col">
	<div class="flex h-screen">
		<div class="relative flex-grow min-h-0">
			<Video {src} canControl={$ownerStore} />
			{#if !$ownerStore && !joined}
				<button
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
							px-8 py-2 rounded outline-none
							text-white bg-green-500 hover:bg-green-600
							transition-all duration-200"
					on:click={join}>Join</button
				>
			{/if}
		</div>
		<Chat />
	</div>
	{#if $ownerStore}
		<RoomControl on:urlUpdated={handleUrlUpdated} />
	{/if}
</div>
