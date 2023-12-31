<script lang="ts">
	import { onMount } from 'svelte';
	import { roomKeyStore, ownerStore, hostAlreadyConnectedStore } from './roomStore.js';
	import { connectToHostPeer, initializePeer, sendToAllPeers } from '../peer/peerService.js';

	// components
	import Player from '../player/Player.svelte';
	import RoomControl from './components/RoomControl.svelte';
	import Chat from '../chat/Chat.svelte';
	import { videoSourceStore } from '../player/playerStore.js';
	import { VIDEO_SRC, VIDEO_TIME } from './localStorageKeys.js';

	// peer
	export let id: string | undefined = undefined;
	onMount(() => {
		roomKeyStore.set(id);

		const videoSrcLS = localStorage.getItem(VIDEO_SRC);
		if (videoSrcLS) videoSourceStore.set(videoSrcLS);

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
		localStorage.setItem(VIDEO_SRC, roomControlUrl);
		localStorage.setItem(VIDEO_TIME, String(0));
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

<div class="flex">
	<div class="flex flex-grow flex-col">
		<!-- player -->
		<div class="relative h-screen">
			<Player src={$videoSourceStore} canControl={$ownerStore} />

			{#if !$ownerStore && !joined && !$hostAlreadyConnectedStore}
				<button
					class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
							rounded bg-green-600 px-8 py-2
							text-white outline-none transition-all
							duration-200 hover:bg-green-700"
					on:click={join}>Join</button
				>
			{/if}
			{#if $hostAlreadyConnectedStore}
				<button
					class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
							rounded bg-orange-600 px-8 py-2
							text-white outline-none transition-all
							duration-200 hover:bg-orange-700"
					on:click={refresh}
					>Host client already running. Refresh page to reconnect
				</button>
			{/if}
		</div>
		<!-- control -->
		{#if $ownerStore}
			<RoomControl on:urlUpdated={handleUrlUpdated} />
		{/if}
	</div>

	<Chat />
</div>
