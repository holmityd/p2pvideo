<script lang="ts">
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import { Icon, InformationCircle, XMark } from 'svelte-hero-icons';
	import { alertDelete } from './alertService';
	import type { AlertColor } from './alertStore';

	// Props
	export let visible: Writable<boolean> = writable(false);
	export let color: AlertColor;
	export let message: string;

	// Lifecycle
	onMount(() => {
		visible.set(true);
	});
</script>

{#if $visible}
	<div transition:fly={{ x: 100 }}>
		<div
			{color}
			class="flex items-center gap-3 divide-red-300 rounded-lg border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:divide-red-800 dark:border-red-800 dark:bg-gray-800 dark:text-red-400"
			role="alert"
		>
			<Icon src={InformationCircle} size="20" class="inline-block min-w-[20px]" />
			<div class="grow">{message}</div>
			<button
				type="button"
				class="rounded-lg p-1.5 text-red-500 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 dark:hover:bg-gray-700 dark:hover:text-red-300"
				aria-label="Close"
				on:click={() => alertDelete(message)}
			>
				<span class="sr-only">Close</span>
				<Icon mini src={XMark} size="20" />
			</button>
		</div>
	</div>
{/if}
