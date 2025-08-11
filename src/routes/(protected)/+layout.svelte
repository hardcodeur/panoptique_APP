<script lang="ts">
import '../../app.css';
import 'flowbite';

import { page } from "$app/state";
import { userStore } from "$lib/stores/UserStore"

import Header from "$lib/components/header/Header.svelte";
import SideNavBar from "$lib/components/sidebar/SideNavBar.svelte";
import { onMount } from 'svelte';
import { startProactiveTokenRefresh } from '$lib/services/refreshManager';

let {children} = $props();

// Data from serveur
const {user} = page.data;

// Update store in real time
$effect(()=>{
	if (user) {
		userStore.set({
			id: user.id,
			email:user.email,
			fullName: user.fullName,
			role: user.role,
		})
	}	
})

onMount(() => {
    // Refresh access token auto
    const cleanup = startProactiveTokenRefresh();
    // Return the cleanup when the component is destroyed.
    return cleanup;
});

</script>

<Header/>
<SideNavBar/>
<main class="py-2 px-4 sm:ml-64 mt-18">
	{@render children()}
</main>