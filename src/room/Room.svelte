<script lang="ts">
	import { onMount } from 'svelte';
	import { roomKeyStore, ownerStore, hostAlreadyConnectedStore } from './roomStore.js';
	import { connectToHostPeer, initializePeer, sendToAllPeers } from '../peer/peerService.js';

	// components
	import Video from '../video/Video.svelte';
	import RoomControl from './components/RoomControl.svelte';
	import Chat from '../chat/Chat.svelte';
	import { videoSourceStore } from '../video/videoStore.js';

	// peer
	export let id: string | undefined = undefined;
	onMount(() => {
		roomKeyStore.set(id);
		import('peerjs').then(({ Peer }) => {
			initializePeer(Peer);
		});
	});

	// video

	// room control
	let roomControlUrl: string = '';
	function handleUrlUpdated(event: CustomEvent) {
		roomControlUrl = event.detail; // the updated url is available in the event detail
		console.log('URL Updated:', roomControlUrl);
		sendToAllPeers({
			action: 'change_src',
			data: roomControlUrl
		});
		videoSourceStore.set(roomControlUrl);
	}

	let joined = false;
	function join() {
		joined = true;
		connectToHostPeer($roomKeyStore);
	}

	function refresh() {
		location.reload();
	}
</script>

<div class="flex flex-col">
	<div class="flex h-screen">
		<div class="relative flex-grow min-h-0">
			<Video src={$videoSourceStore} canControl={$ownerStore} />

			{#if !$ownerStore && !joined && !$hostAlreadyConnectedStore}
				<button
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
							px-8 py-2 rounded outline-none
							text-white bg-green-600 hover:bg-green-700
							transition-all duration-200"
					on:click={join}>Join</button
				>
			{/if}
			{#if $hostAlreadyConnectedStore}
				<button
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
							px-8 py-2 rounded outline-none
							text-white bg-orange-600 hover:bg-orange-700
							transition-all duration-200"
					on:click={refresh}
					>Host client already running. Refresh page to reconnect
				</button>
			{/if}
		</div>
		<Chat />
	</div>
	{#if $ownerStore}
		<RoomControl on:urlUpdated={handleUrlUpdated} />
	{/if}
</div>
