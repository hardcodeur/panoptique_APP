<script lang="ts">
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    import {Button,Label,Helper,Select,Datepicker} from "flowbite-svelte";
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

    console.log(itemUpdate);
    
    
    const dateToday = new Date();
    const dateTomorrow = new Date(dateToday);
    dateTomorrow.setDate(dateTomorrow.getDate() + 1);

    // state var
    let missionStartDate: Date|null = $state(null);
    let missionStartTime: string|null = $state(null);
    let missionEndDate: Date|null = $state(null);
    let missionEndTime: string|null = $state(null);
    let customerSelected: string = $state("");
    let teamSelected: string = $state("");
    // hidden fields
    let missionStart: string|null = $state(null);
    let missionEnd: string|null = $state(null);

    let initialized: boolean = $state(false);


    // Unify input date and Time
    function unifyDate(dateField: Date,hourField: string): string{
        const [hours, minutes] = hourField.split(':').map(Number);
        const newDate = new Date(dateField.toISOString());
        newDate.setHours(hours,minutes,0,0);
        return newDate.toISOString()
    }

    function getDateBySting(date: string): Date{
        return new Date(date);
    }

    function getTimeBySting(date: string): string{
        return new Date(date).toTimeString().slice(0, 5);
    }
    
    // reload component after submit form
    const handleEnhance = ()=>{
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
            missionStartDate = getDateBySting(itemUpdate.start);
            missionStartTime = getTimeBySting(itemUpdate.start);
            missionEndDate = getDateBySting(itemUpdate.end);
            missionEndTime = getTimeBySting(itemUpdate.end);
            customerSelected = itemUpdate.customerId;
            teamSelected = itemUpdate.teamId;
            initialized = true; // Mark as initialized
        } else if (submittedData) { // handle form submission errors
            console.log(itemUpdate);
            if (submittedData.start) {
                missionStartDate = getDateBySting(submittedData.start);
                missionStartTime = getTimeBySting(submittedData.start);
            }
            if (submittedData.end) {
                missionEndDate = getDateBySting(submittedData.end);
                missionEndTime = getTimeBySting(submittedData.end);
            }
            customerSelected = submittedData.customer || '';
            teamSelected = submittedData.team || '';
        } else if (!itemUpdate) { // reset form for new item creation
            missionStartDate = null;
            missionStartTime = null;
            missionEndDate = null;
            missionEndTime = null;
            customerSelected = '';
            teamSelected = '';
            initialized = false;
        }

        // unify date and time for form submission
        if(missionStartDate && missionStartTime){
            missionStart = unifyDate(missionStartDate,missionStartTime);
        } else {
            missionStart = null;
        }
        if(missionEndDate && missionEndTime){
           missionEnd = unifyDate(missionEndDate,missionEndTime)
        } else {
            missionEnd = null;
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
        <span class="ts-text-bold mb-3">Arrivée du bateaux</span>
        <input type="hidden" name="start" bind:value={missionStart} >
        <div class="flex items-center gap-7 mb-2">
            <div>
                <Label class="ts-text bloc mb-2">Date</Label>
                <Datepicker bind:value={missionStartDate} locale="fr-FR" />
            </div>
            <div>
                <Label class="ts-text block mb-2">Horaire</Label>
                <input type="time" bind:value={missionStartTime} required />
            </div>
        </div>
        {#if errors?.start}
        <Helper class={helperClass}> 
            {errors.start[0]}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <span class="ts-text-bold mb-3">Départ du bateaux</span>
        <input type="hidden" name="end" bind:value={missionEnd} >
        <div class="flex items-center gap-7 mb-2">
            <div>
                <Label class="ts-text bloc mb-2">Date</Label>
                <Datepicker bind:value={missionEndDate} locale="fr-FR" />
            </div>
            <div>
                <Label class="ts-text block mb-2">Horaire</Label>
                <input type="time" bind:value={missionEndTime} required />
            </div>
        </div>
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