<script lang="ts">
	import '../app.css';
	import { isAuth} from "$lib/stores/auth/authStore.svelte";
	
	import Header from "$lib/components/header/Header.svelte";
	import SideNavBar from "$lib/components/sidebar/SideNavBar.svelte";
	import Footer from "$lib/components/footer/Footer.svelte";

	let { children } = $props();
	
</script>

{#if !isAuth }
<main>
	{@render children()}
</main>
{:else}
<Header/>
<div class="flex">
	<SideNavBar/>
	<main class="w-full">
		{@render children()}
	</main>
</div>
{/if}