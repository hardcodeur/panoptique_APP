<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import { login} from "$lib/stores/auth/authStore.svelte";

    import { Section, Register } from "flowbite-svelte-blocks";
    import { Button, Label, Input } from "flowbite-svelte";
    import logo from "$lib/assets/logo/panoptique_logo_black.svg";

    // Reçoit automatiquement les données retournées par l'action serveur
    export let form; 
    $: error = form?.error;
    $: if (form?.success) {
      login();
      goto("/dashboard");
    }
</script>

<Section name="login" sectionClass="max-w-md mx-auto mt-10 p-6">
  <Register aClass="flex items-center mb-4" divClass="'w-full md:mt-0 sm:max-w-md xl:p-0">
    <svelte:fragment slot="top">
      <img class="h-16" src="{logo}" alt="logo" />
    </svelte:fragment>
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <form class="flex flex-col space-y-6" use:enhance method="POST">
        <h3 class="ts-title-2 p-0">Connexion</h3>
        {#if error}
        <!-- Changer le style -->
        <div class="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
        {/if}
        <Label class="space-y-2">
          <span>Email</span>
          <Input type="email" name="email" placeholder="email@pto.com" required />
        </Label>
        <Label class="space-y-2">
          <span>Mot de passe</span>
          <Input type="password" name="password" placeholder="•••••" required />
        </Label>
        <Button type="submit" class="bg-th-blue color-white">Sign in</Button>
      </form>
    </div>
  </Register>
</Section>