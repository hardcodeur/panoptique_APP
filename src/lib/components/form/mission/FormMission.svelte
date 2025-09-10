<script lang="ts">
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    import {Button,Label,Helper,Select,Input} from "flowbite-svelte";
    import type { ActionResult } from '@sveltejs/kit';
    import type {SelectInputValue} from "$lib/types"
    import type { ActionData } from './$types';

    let { 
        formReturn,
        formComponentData,
        itemUpdate = null
    } : { formReturn: ActionData | null; 
        formComponentData: any; 
        itemUpdate?: any 
    } = $props();

    let errors= $derived(formReturn?.errors);
    let submittedData= $derived(formReturn?.formData);
    let formAction: string= $derived(itemUpdate ? `?/missionUpdate`: '?/missionAdd');
    
    // state var
    let missionStart: string|null = $state(null);
    let missionEnd: string|null = $state(null);
    let customerSelected: string = $state("");
    let teamSelected: string = $state("");
    let initialized: boolean = $state(false);

    function convertDateISOToSting(isoString: string): string{
        const date = new Date(isoString)
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0')
        const hours = date.getHours().toString().padStart(2, '0'); 
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    // reload component after submit form
    const handleEnhance = ({ formData })=>{

        const start = formData.get('start');
        if (start && typeof start === 'string' && start.length > 0) {
            formData.set('start', new Date(start).toISOString());
        }
        const end = formData.get('end');
        if (end && typeof end === 'string' && end.length > 0) {
            formData.set('end', new Date(end).toISOString());
        }
        
        return async ({ result,update }: { result: ActionResult,update:()=>void })=>{
            if (result.type === 'success'){
                await invalidateAll();
            }
            update();
        }
    }

    const teamList = formComponentData.teamList;
    let teamItems :SelectInputValue[] = $state([]);
    teamList.forEach(team => {
        teamItems = [...teamItems, { value: team.id, name: team.teamName }];
    });

    const customerList = formComponentData.customerList;
    let customerItems :SelectInputValue[] = $state([]);
        customerList.forEach(customer => {
        customerItems = [...customerItems, { value: customer.id, name: customer.name }];
    });
    
    $effect(()=>{
        // field values
        if (itemUpdate && !initialized) { // init form with update data
            missionStart = convertDateISOToSting(itemUpdate.start);
            missionEnd = convertDateISOToSting(itemUpdate.end);
            customerSelected = itemUpdate.customerId;
            teamSelected = itemUpdate.teamId;
            initialized = true; // Mark as initialized
        } else if (submittedData) { // handle form submission errors
            missionStart = convertDateISOToSting(itemUpdate.start);
            missionEnd = convertDateISOToSting(itemUpdate.end);
            customerSelected = submittedData.customer;
            teamSelected = submittedData.team;
        } else if (!itemUpdate) { // reset form for new item creation
            missionStart = "";
            missionEnd = "";
            customerSelected = '';
            teamSelected = '';
            initialized = false;
        }
    });

    const inputDisabled = (itemUpdate) ? true  : false
    const btnClass="text-center focus-within:ring-4 focus-within:outline-hidden inline-flex items-center justify-center px-5 py-2.5 text-white bg-th-blue hover:bg-primary-800 rounded-lg"
    const helperClass="text-sm text-th-red mt-2";
    
</script>

<form use:enhance={handleEnhance} method="POST" action={formAction} class="mb-6">
    {#if itemUpdate}
    <input type="hidden" name="missionId" value="{itemUpdate.id}">
    {/if}
    <div class="mb-6">
        <Label for="start" class="ts-text-bold block mb-2">Arrivée du bateaux</Label>
        <Input type="datetime-local" class="text-th-black border-th-black-light" id="start" bind:value={missionStart} name="start"/>
        {#if errors?.start}
        <Helper class={helperClass}> 
            {errors.start[0]}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label for="end" class="ts-text-bold block mb-2">Départ du bateaux</Label>
        <Input type="datetime-local" class="text-th-black border-th-black-light" id="end" bind:value={missionEnd} name="end"/>
        {#if errors?.end}
        <Helper class={helperClass}> 
            {errors.end[0]}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label class="ts-text-bold mb-2">
            Équipe
            <Select disabled={inputDisabled} name="team" class="mt-2 ts-text text-th-black border-th-black-light capitalize" placeholder="Liste des équipes" items={teamItems} bind:value={teamSelected} />
        </Label>
        {#if errors?.team}
        <Helper class={helperClass}> 
            {errors.team[0]}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label class="ts-text-bold mb-2">
            Client
            <Select disabled={inputDisabled} name="customer" class="mt-2 ts-text text-th-black border-th-black-light capitalize" placeholder="Liste des clients" items={customerItems} bind:value={customerSelected} />
        </Label>
        {#if errors?.customer}
        <Helper class={helperClass}> 
            {errors.customer[0]}
        </Helper>
        {/if}
    </div>
    <div class="flex justify-end pb-4 space-x-4 md:px-4">
      <Button type="submit" class={btnClass}>Enregistrer</Button>
    </div>
</form>