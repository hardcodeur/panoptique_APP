<script lang="ts">
	import '../../app.css';	

	let { children } = $props();
	
</script>

<main class="min-h-screen flex items-center justify-center">
	{@render children()}
</main>