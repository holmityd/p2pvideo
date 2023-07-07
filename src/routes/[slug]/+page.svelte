<script>
	/** @type {import('./$types').PageData} */
	export let data;
	import Room from '../../room/Room.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<!-- <section class="flex flex-col justify-center items-center"> -->
<Room id={data.slug} />
<!-- </section> -->
