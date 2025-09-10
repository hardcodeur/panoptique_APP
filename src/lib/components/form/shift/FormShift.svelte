<script lang="ts">
    import type { ActionResult } from '@sveltejs/kit';
    import { enhance } from '$app/forms';
    import {Button,Label, Input, Helper,MultiSelect} from "flowbite-svelte";
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
    let submittedData= $derived(formReturn?.formData);
    let formAction: string= $derived(itemUpdate ? `?/`: '?/');

    $inspect(itemUpdate);
    
    
    // State
    let initialized: boolean = $state(false);
    let teamName = $state("");
    

    let multiSelected: string[] = $state([]);
    // teamList.forEach(team => {
    //     teamItems = [...teamItems, { value: team.id, name: team.teamName }];
    // });

    const handleEnhance = ()=>{
        return async ({ result,update }: { result: ActionResult,update:()=>void })=>{
            if (result.type === 'success'){
                await invalidateAll();
            }
            update();
        }
    }

    $effect(() => {
        // field values
        if (itemUpdate && !initialized) { // init form with update data
            teamName = itemUpdate.teamName || '';
            initialized = true; // Mark as initialized
        } else if (submittedData) { // handle form submission errors
            teamName = submittedData.teamName || '';
        } else if (!itemUpdate) { // reset form for new item creation
            teamName = '';
            initialized = false;
        }
    });


    const helperClass="text-sm text-th-red mt-2"
    const btnClass="text-center focus-within:ring-4 focus-within:outline-hidden inline-flex items-center justify-center px-5 py-2.5 text-white bg-th-blue hover:bg-primary-800 rounded-lg"
</script>

<form use:enhance={handleEnhance} method="POST" action={formAction} class="mb-6">
    <input type="hidden" name="missionId" value="{itemUpdate.id}">
    <div class="mb-6">
        <div>
            <p>Type de quart :</p>
        </div>
        <div>
            <Label for="teamName" class="ts-text-bold block mb-2">Début de quart</Label>
            <Input type="datetime-local" class="text-th-black" bind:value={teamName} id="teamName" name="teamName" placeholder="Equipe ..." />
            {#if errors?.teamName}
            <Helper class={helperClass}> 
                {errors.teamName[0]}
            </Helper>
            {/if}
        </div>
        <div>
            <Label for="teamName" class="ts-text-bold block mb-2">Agent(s) assigné(s)</Label>
            <Input type="datetime-local" class="text-th-black" bind:value={teamName} id="teamName" name="teamName" placeholder="Equipe ..." />
            {#if errors?.teamName}
            <Helper class={helperClass}> 
                {errors.teamName[0]}
            </Helper>
            {/if}
        </div>
    </div>
    <div class="flex justify-end pb-4 space-x-4 md:px-4">
        <Button type="submit" class={btnClass}>Enregistrer</Button>
    </div>
</form>