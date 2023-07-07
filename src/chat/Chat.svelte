<script lang="ts">
	import { Icon, ArrowLeftOnRectangle, ArrowRightOnRectangle } from 'svelte-hero-icons';
	import { getName } from '../peer/peerName';
	import { tooltip } from '../actions/tooltip';
	import { peersStore, userIdStore } from '../peer/peerStore';
	import { writable } from 'svelte/store';

	let hide = false;
	$: buttonText.set(!hide ? 'collapse' : 'expand');
	const buttonText = writable('');
	function toggleHide(): void {
		hide = !hide;
	}
</script>

<!-- arrow-left-on-rectangle -->
<div class="relative flex flex-col {!hide ? 'w-60' : 'w-0'}">
	<button
		class="absolute top-4 {!hide ? 'left-4' : '-left-8'} text-white"
		use:tooltip={buttonText}
		on:click={toggleHide}
	>
		<Icon src={!hide ? ArrowRightOnRectangle : ArrowLeftOnRectangle} size="20" />
	</button>
	{#if !hide}
		<div class="p-4">
			<h5 class="font-semibold text-white mb-2 pl-6">Users:</h5>
			<ul class="overflow-y-auto scrollbar scrollbar-thumb-gray-900 scrollbar-thin">
				{#if $userIdStore}
					<li
						class="w-full whitespace-nowrap text-ellipsis overflow-hidden text-white mb-1 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-2 rounded-md"
					>
						{getName($userIdStore)}
					</li>
				{/if}
				{#each $peersStore as item, index}
					<li
						class="w-full whitespace-nowrap text-ellipsis overflow-hidden text-white mb-1 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-2 rounded-md"
					>
						{getName(item)}
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
