<script lang="ts">
    import type { ActionResult } from '@sveltejs/kit';
    import { enhance } from '$app/forms';
    import {Button,Label, Input, Helper} from "flowbite-svelte";
    import { invalidateAll } from "$app/navigation"
    const { 
        formReturn,
        itemUpdate = null
    } = $props();

    let errors= $derived(formReturn?.errors);
    let teamName = $state("");
    let submittedData= $derived(formReturn?.formData);

    const handleEnhance = ()=>{
        return async ({ result,update }: { result: ActionResult,update:()=>void })=>{
            if (result.type === 'success'){
                await invalidateAll();
            }
            update();
        }
    }

    $effect(()=>{
        // field values
        if (itemUpdate && !submittedData) { // update Team         
            teamName= itemUpdate.teamName || '';
        } else if (submittedData) { // data Team return last submited or update in form 
            teamName=  submittedData.teamName || '';
        }else{ // default
            teamName= '';
        }

    });

    const helperClass="text-sm text-th-red mt-2"
    const btnClass="text-center focus-within:ring-4 focus-within:outline-hidden inline-flex items-center justify-center px-5 py-2.5 text-white bg-th-blue hover:bg-primary-800 rounded-lg"
</script>

<form use:enhance={handleEnhance} method="POST" action="?/addTeam" class="mb-6">
    <div class="mb-6">
        <Label for="teamName" class="ts-text-bold block mb-2">Nom de l'équipe</Label>
        <Input class="text-th-black-light" bind:value={teamName} id="teamName" name="teamName" placeholder="Equipe ..." />
        {#if errors?.teamName}
        <Helper class={helperClass}> 
            {errors.teamName[0]}
        </Helper>
        {/if}
    </div>
    <div class="flex justify-end pb-4 space-x-4 md:px-4">
        <Button type="submit" class={btnClass}>Enregistrer</Button>
    </div>
</form>