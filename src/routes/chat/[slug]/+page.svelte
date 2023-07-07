<script>
	/** @type {import('./$types').PageData} */
	export let data;
	import Chat from '../../../chat-old/Chat.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="flex flex-col justify-center items-center">
	<Chat room={data.slug} />
</section>
