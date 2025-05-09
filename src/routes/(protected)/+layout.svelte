<script lang="ts">
import '../../app.css';
import 'flowbite';
import { onMount } from 'svelte';
import Header from "$lib/components/header/Header.svelte";
import SideNavBar from "$lib/components/sidebar/SideNavBar.svelte";


onMount(async () => {
	const { initFlowbite } = await import('flowbite');
    initFlowbite();
});

let { children } = $props();

const mainClass="py-2 px-4 sm:ml-64 mt-18"
</script>

<Header/>
<SideNavBar/>
<main class={mainClass}>
	{@render children()}
</main>