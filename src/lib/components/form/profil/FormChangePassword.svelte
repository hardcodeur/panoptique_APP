<script lang="ts">
    import type { ActionResult } from '@sveltejs/kit';
    import { enhance } from '$app/forms';
    import {Button,Label, Input, Helper} from "flowbite-svelte";
    import { invalidateAll } from "$app/navigation"
    import type { ActionData } from './$types';
    const { 
        formReturn,
        itemUpdate = null
    }: { 
        formReturn: ActionData | null; 
        itemUpdate?: any 
    } = $props();

    let errors= $derived(formReturn?.errors);
    
    let newPass = $state("");
    let confirmNewPass = $state("");

    const handleEnhance = ()=>{
        return async ({ result,update }: { result: ActionResult,update:()=>void })=>{
            if (result.type === 'success'){
                await invalidateAll();
            }
            update();
        }
    }

    const helperClass="text-sm text-th-red mt-2"
    const btnClass="text-center focus-within:ring-4 focus-within:outline-hidden inline-flex items-center justify-center px-5 py-2.5 text-white bg-th-blue hover:bg-primary-800 rounded-lg"
</script>

<form use:enhance={handleEnhance} method="POST" action="?/passUpdate" class="mb-6">
    {#if itemUpdate}
    <input type="hidden" name="profilId" value="{itemUpdate.id}">
    {/if}
    <div class="mb-6">
        <Label for="newPass" class="ts-text-bold block mb-2">Nouveau mot de passe</Label>
        <Input type="password" class="text-th-black" bind:value={newPass} id="newPass" name="newPass"/>
        {#if errors?.newPass}
        <Helper class={helperClass}> 
            {errors.newPass[0]}
        </Helper>
        {/if}
    </div>
        <div class="mb-6">
        <Label for="confirmNewPass" class="ts-text-bold block mb-2">Confirmer mot de passe</Label>
        <Input type="password" class="text-th-black" bind:value={confirmNewPass} id="confirmNewPass" name="confirmNewPass"/>
        {#if errors?.confirmNewPass}
        <Helper class={helperClass}> 
            {errors.confirmNewPass[0]}
        </Helper>
        {/if}
    </div>
    <div class="flex justify-end pb-4 space-x-4 md:px-4">
        <Button type="submit" class={btnClass}>Enregistrer</Button>
    </div>
</form>