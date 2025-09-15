<script lang="ts">
import '../../app.css';
import 'flowbite';

import { page } from "$app/state";

import Header from "$lib/components/header/Header.svelte";
import SideNavBar from "$lib/components/sidebar/SideNavBar.svelte";
	import { onMount } from 'svelte';
	import { initFlowbite } from 'flowbite';


let {children} = $props();

onMount(()=>{
	initFlowbite()
})

// Data from serveur
const {user} = page.data;
</script>

<Header/>
<SideNavBar userRole={user.role}/>
<div class="mx-auto max-w-screen-2xl">
	<main class="py-2 px-4 sm:ml-64 mt-18">
		{@render children()}
	</main>
</div>