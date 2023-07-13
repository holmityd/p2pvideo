<script lang="ts">
	import { alerts } from './alertStore';
	import Alert from './Alert.svelte';
</script>

<div class="fixed top-1 right-1 flex flex-col gap-1 w-96 z-50">
	{#each $alerts as alert}
		<Alert message={alert.message} />
	{/each}
</div>
