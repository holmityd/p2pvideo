<script lang="ts">
	import { Icon, InformationCircle, XMark } from 'svelte-hero-icons';
	import { alertDelete } from './alertService';

	// Props
	export let message: string;
</script>

<div
	class="bg-red-50 shadow dark:bg-gray-800 text-red-800 dark:text-red-400 rounded-lg border-red-300 dark:border-red-800 divide-red-300 dark:divide-red-800 p-4 gap-3 text-sm flex items-center"
	role="alert"
>
	<Icon src={InformationCircle} size="20" class="min-w-[20px]" />
	<div>{message}</div>
	<button
		type="button"
		class="focus:outline-none whitespace-normal m-0.5 rounded-lg focus:ring-2 p-1.5 text-red-500 focus:ring-red-400 hover:bg-red-200 dark:hover:text-red-300 ml-auto -my-1.5 dark:hover:bg-gray-700"
		aria-label="Close"
		on:click={() => alertDelete(message)}
	>
		<span class="sr-only">Close</span>
		<Icon src={XMark} size="20" />
	</button>
</div>
