<script lang="ts">
import '../../app.css';
import 'flowbite';

import { page } from "$app/state";

import Header from "$lib/components/header/Header.svelte";
import SideNavBar from "$lib/components/sidebar/SideNavBar.svelte";


let {children} = $props();

// Data from serveur
const {user} = page.data;
</script>

<Header/>
<SideNavBar/>
<main class="py-2 px-4 sm:ml-64 mt-18">
	{@render children()}
</main>