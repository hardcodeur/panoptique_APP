<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import { Section, Register } from "flowbite-svelte-blocks";
    import { Button, Label, Input,Helper } from "flowbite-svelte";
    import logo from "$lib/assets/logo/panoptique_logo_black.svg";
    import type { ActionData } from './$types';

    // Reçoit automatiquement les données retournées par l'action serveur
    let { form } : { form: ActionData } = $props();
    let errors: Partial<Record<string, string[]>> | undefined = $state(undefined);
    let email :string = $state("")

    let helperClass="text-sm text-th-red mt-2"

    $effect(()=>{
      errors = form?.errors;
      email = form?.email ?? ""
      if (form?.success) {
      goto("/dashboard");
    }
    })
</script>

<Section name="login" sectionClass="max-w-md mx-auto mt-10 p-6">
  <Register aClass="flex items-center mb-4" divClass="'w-full md:mt-0 sm:max-w-md xl:p-0">
    <svelte:fragment slot="top">
      <img class="h-16" src="{logo}" alt="logo" />
    </svelte:fragment>
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <form class="flex flex-col space-y-6" use:enhance method="POST">
        <h3 class="ts-title-2 p-0 text-center">Connexion</h3>
        {#if errors?._global}
        <div class="mb-4 p-2 text-center text-th-red rounded">
          {errors._global}
        </div>
        {/if}
        <Label class="space-y-2">
          <span>Email</span>
          <Input type="email" name="email" bind:value={email} placeholder="email@pto.com" />
          {#if errors?.email}
          <Helper class={helperClass}> 
              {errors.email}
          </Helper>
          {/if}
        </Label>
        <Label class="space-y-2">
          <span>Mot de passe</span>
          <Input type="password" name="password" placeholder="•••••" />
          {#if errors?.email}
          <Helper class={helperClass}> 
              {errors.password}
          </Helper>
          {/if}
        </Label>
        <Button type="submit" class="bg-th-blue color-white">Connexion</Button>
      </form>
    </div>
  </Register>
</Section>