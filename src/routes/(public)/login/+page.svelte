<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Section, Register } from 'flowbite-svelte-blocks';
	import { Button, Label, Input, Helper } from 'flowbite-svelte';
	import logo from '$lib/assets/logo/panoptique_logo_black.svg';
	import type { ActionData } from './$types';

	// Data returned by server action.
	let { form }: { form: ActionData } = $props();

	const helperClass = 'text-sm text-th-red mt-2';

	// Handle form action
	function handleLogin() {    
		return async ({ result, update }) => {
			if (result.type === 'success') {
				await goto('/');
			}
			// Update form with action data
			await update();
		};
	}
</script>

<Section name="login" sectionClass="max-w-md mx-auto">
	<Register href="*" aClass="flex items-center mb-4" divClass="'w-full'">
		<svelte:fragment slot="top">
			<img class="h-16" src={logo} alt="logo" />
		</svelte:fragment>
		<div class="sm:pt-8 w-full">
			<form class="flex flex-col space-y-6 w-full" use:enhance={handleLogin} method="POST">
				<h3 class="ts-title-2 p-0 text-center">Connexion</h3>

				{#if form?.error && '_global' in form.error}
					<div class="mb-4 p-2 text-center text-th-red rounded">
						{form.error._global[0]}
					</div>
				{/if}

				<Label class="space-y-2">
					<span>Email</span>
					<Input type="email" name="email" value={form?.email ?? ''} placeholder="email@sgs.com" />
					{#if form?.error && 'email' in form.error && form.error.email}
						<Helper class={helperClass}>
							{form.error.email[0]}
						</Helper>
					{/if}
				</Label>
				<Label class="space-y-2">
					<span>Mot de passe</span>
					<Input type="password" name="password" placeholder="•••••" />
					{#if form?.error && 'password' in form.error && form.error.password}
						<Helper class={helperClass}>
							{form.error.password[0]}
						</Helper>
					{/if}
				</Label>
				<Button type="submit" class="bg-th-blue color-white">Connexion</Button>
			</form>
		</div>
	</Register>
</Section>
