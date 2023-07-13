<script lang="ts">
	import { getName } from '../../peer/peerName';
	import { peersStore, userIdStore } from '../../peer/peerStore';
	import UserListItem from './UserListItem.svelte';
</script>

<h5 class="font-semibold text-white mb-2 pl-6">Users:</h5>
<ul class="overflow-y-auto scrollbar scrollbar-thumb-gray-900 scrollbar-thin">
	{#if $userIdStore}
		<UserListItem name={getName($userIdStore)} />
	{/if}
	{#each $peersStore as item}
		<UserListItem name={getName(item)} />
	{/each}
</ul>
