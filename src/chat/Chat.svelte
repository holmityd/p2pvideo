<script lang="ts">
	import { Icon, ArrowLeftOnRectangle, ArrowRightOnRectangle } from 'svelte-hero-icons';
	import { tooltip } from '../actions/tooltip';
	import { writable } from 'svelte/store';
	import UserList from './components/UserList.svelte';

	let hide = false;
	$: buttonText.set(!hide ? 'collapse' : 'expand');
	const buttonText = writable('');
	function toggleHide(): void {
		hide = !hide;
	}
</script>

<div class="relative {!hide ? 'w-60 min-w-[15rem]' : 'w-0'}">
	<div class="fixed w-60 h-screen flex flex-col border-l-black bg-gray-950 border-l-2">
		<button
			class="absolute top-4 {!hide ? 'left-4' : '-left-8'} text-white"
			use:tooltip={{ tooltipText: buttonText, position: 'left' }}
			aria-label={$buttonText}
			on:click={toggleHide}
		>
			<Icon src={!hide ? ArrowRightOnRectangle : ArrowLeftOnRectangle} size="20" />
		</button>
		{#if !hide}
			<div class="p-4">
				<UserList />
			</div>
		{/if}
	</div>
</div>
