<script lang="ts">
	import '../../app.css';
	import Header from "$lib/components/header/Header.svelte";
	import SideNavBar from "$lib/components/sidebar/SideNavBar.svelte";

	let { children } = $props();
	
</script>


<Header/>
<div class="flex antialiased">
	<SideNavBar/>
	<main class="p-4 h-auto w-full">
		{@render children()}
	</main>
</div>