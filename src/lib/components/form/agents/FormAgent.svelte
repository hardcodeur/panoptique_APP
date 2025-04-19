<script lang="ts">
    import { enhance } from '$app/forms';
    import type { FormSchemas } from "$lib/types";
    import {Button,Label, Input, Helper,Select} from "flowbite-svelte";
    import { formStore,resetFormStore } from "$lib/stores/form/agentStore";
    import type {SelectInputValue} from "$lib/types"

    let { 
        form,
        resetForm,
    } = $props();

    let roleSelected:string = $state("");
    let teamSelected:string = $state("");
    let initialLoad = $state(true);
    
    $effect(() => {
        
        if (resetForm) {
            resetFormStore();
            roleSelected = "";
            teamSelected = "";
            return;
        }

        if (form && initialLoad) {

            formStore.update(store => ({
                errors: form.errors || {},
                values: { ...store.values, ...form.fieldValue }
            }));

            if (form.fieldValue.role !== roleSelected) {
                roleSelected = form.fieldValue.role;
            }
            if (form.fieldValue.team !== teamSelected) {
                teamSelected = form.fieldValue.team;
            }

            initialLoad = false;
        }
    });
    
    let roleItems :SelectInputValue[] = [
        { value: 'us', name: 'United States' },
        { value: 'ca', name: 'Canada' },
        { value: 'fr', name: 'France' }
    ];

    let teamItems :SelectInputValue[] = [
        { value: 'us', name: 'United States' },
        { value: 'ca', name: 'Canada' },
        { value: 'fr', name: 'France' }
    ];

    let btnClass="text-center focus-within:ring-4 focus-within:outline-hidden inline-flex items-center justify-center px-5 py-2.5 text-white bg-th-blue hover:bg-primary-800 rounded-lg"
    let helperClass="text-sm text-th-red mt-2"


</script>

<form use:enhance method="POST" action="?/add" class="mb-6">
    <div class="mb-6">
        <Label for="name" class="ts-text-bold block mb-2">Nom</Label>
        <Input class="text-th-black-light" id="name" bind:value={$formStore.values.name} name="name" placeholder="Jean" />
        {#if $formStore.errors?.name}
        <Helper class={helperClass}> 
            {$formStore.errors.name}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label for="surname" class="ts-text-bold block mb-2">Prénom</Label>
        <Input class="text-th-black-light" id="surname" bind:value={$formStore.values.surname} name="surname" placeholder="Dupont" />
        {#if $formStore.errors?.surname}
        <Helper class={helperClass}> 
            {$formStore.errors.surname}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label for="email" class="ts-text-bold block mb-2">Email</Label>
        <Input class="text-th-black-light" id="email" bind:value={$formStore.values.email} name="email" placeholder="j.dupont@sgs.com" />
        {#if $formStore.errors?.email}
        <Helper class={helperClass}> 
            {$formStore.errors.email}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label for="phone" class="ts-text-bold block mb-2">Téléphone</Label>
        <Input class="text-th-black-light" id="phone" bind:value={$formStore.values.phone} name="phone" placeholder="0621516978" />
        {#if $formStore.errors?.phone}
        <Helper class={helperClass}> 
            {$formStore.errors.phone}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label class="ts-text-bold mb-2">
            Role
            <Select name="role" class="mt-2 ts-text text-th-black-light" placeholder="Liste des roles" items={roleItems} bind:value={roleSelected} />
        </Label>
        {#if $formStore.errors?.role}
        <Helper class={helperClass}> 
            {$formStore.errors.role}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label class="ts-text-bold mb-2">
            Équipe
            <Select name="team" class="mt-2 ts-text text-th-black-light" placeholder="Liste des équipes" items={teamItems} bind:value={teamSelected} />
        </Label>
        {#if $formStore.errors?.team}
        <Helper class={helperClass}> 
            {$formStore.errors.team}
        </Helper>
        {/if}
    </div>
    <div class="flex justify-end pb-4 space-x-4 md:px-4">
      <Button type="submit" class={btnClass}>Enregistrer</Button>
    </div>
</form>