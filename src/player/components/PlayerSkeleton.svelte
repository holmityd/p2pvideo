<script lang="ts">
	import { Icon, VideoCamera } from 'svelte-hero-icons';
</script>

<div
	role="status"
	class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-1/2 h-1/2 rounded-lg bg-gray-300 animate-pulse dark:bg-gray-700"
>
	<Icon src={VideoCamera} class="w-20 h-20 text-gray-200 dark:text-gray-600" />
	<span class="sr-only">Loading...</span>
</div>
