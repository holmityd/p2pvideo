<script lang="ts">
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import { Alert, Button } from 'flowbite-svelte';
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
		<Alert {color}>
			<div class="flex items-center gap-3">
				<Icon src={InformationCircle} size="20" class="min-w-[20px] inline-block" />
				<span class="grow">{message}</span>
				<Button class="!p-1.5" outline {color} on:click={() => alertDelete(message)}>
					<Icon mini src={XMark} size="20" />
				</Button>
			</div>
		</Alert>
	</div>
{/if}
