<script lang="ts">
	import { Icon, type IconSource } from 'svelte-hero-icons';
	import { tooltip } from '../../actions/tooltip';
	import type { Writable } from 'svelte/store';

	// Props
	export let onClick: (e?: MouseEvent) => void = () => {};
	export let icon: Writable<IconSource>;
	export let tooltipText: Writable<string>;
	export let ariaLabel: string = '';
</script>

<button
	class="w-10 h-10 flex items-center justify-center outline-none text-white hover:bg-gray-600/50 hover:shadow transition-all duration-200"
	on:click={onClick}
	use:tooltip={{ tooltipText }}
	aria-label={$tooltipText ? $tooltipText : ariaLabel}
>
	<Icon src={$icon} size="20" />
</button>
