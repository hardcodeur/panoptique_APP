<script lang="ts">
    import { enhance } from '$app/forms';
    import {Button,Label, Input, Helper,Select} from "flowbite-svelte";
    import type {SelectInputValue} from "$lib/types"
    import type { ActionData } from './$types';

    let { 
        formReturn,
        formData,
        itemUpdate = null
    } : { formReturn: ActionData | null; formData: any; itemUpdate?: any } = $props();

    let errors= $derived(formReturn?.errors);
    let submittedData= $derived(formReturn?.formData);

    let firstName= $state("");
    let lastName= $state("");
    let email= $state("");
    let phone= $state("");
    let roleSelected= $state("");
    let teamSelected= $state("");

    $effect(()=>{
        if (itemUpdate) {
            firstName= itemUpdate.firstName || '';
            lastName= itemUpdate.lastName || '';
            email= itemUpdate.email || '';
            phone= itemUpdate.phone || '';
            roleSelected= itemUpdate.role || '';
            teamSelected= itemUpdate.team || '';
        } else if (submittedData) {
            firstName=  submittedData.firstName || '';
            lastName= submittedData.lastName || '';
            email= submittedData.email || '';
            phone= submittedData.phone || '';
            roleSelected= submittedData.role || '';
            teamSelected= submittedData.team || '';
        }else{
            firstName= '';
            lastName= '';
            email= '';
            phone= '';
            roleSelected= '';
            teamSelected= '';
        }
    });

    const teamList = formData.teamList

    let roleItems :SelectInputValue[] = [
        { value: 'admin', name: 'Administrateur' },
        { value: 'manager', name: "Directeur d'agence" },
        { value: 'team_manager', name: "Chef d'équipe" },
        { value: 'user', name: "Agent" },
    ];
    
    let teamItems :SelectInputValue[] = [];
    teamList.forEach(team => {
        teamItems = [...teamItems, { value: team.teamName, name: team.teamName }];
    });

    const btnClass="text-center focus-within:ring-4 focus-within:outline-hidden inline-flex items-center justify-center px-5 py-2.5 text-white bg-th-blue hover:bg-primary-800 rounded-lg"
    const helperClass="text-sm text-th-red mt-2"

</script>

<form use:enhance method="POST" action="?/add" class="mb-6">
    <div class="mb-6">
        <Label for="firstName" class="ts-text-bold block mb-2">Nom</Label>
        <Input class="text-th-black-light" id="firstName" bind:value={firstName} name="firstName" placeholder="Jean" />
        {#if errors?.firstName}
        <Helper class={helperClass}> 
            {errors.firstName[0]}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label for="lastName" class="ts-text-bold block mb-2">Prénom</Label>
        <Input class="text-th-black-light" id="lastName" bind:value={lastName} name="lastName" placeholder="Dupont" />
        {#if errors?.lastName}
        <Helper class={helperClass}> 
            {errors.lastName[0]}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label for="email" class="ts-text-bold block mb-2">Email</Label>
        <Input class="text-th-black-light" id="email" bind:value={email} name="email" placeholder="j.dupont@sgs.com" />
        {#if errors?.email}
        <Helper class={helperClass}> 
            {errors.email[0]}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label for="phone" class="ts-text-bold block mb-2">Téléphone</Label>
        <Input class="text-th-black-light" id="phone" bind:value={phone} name="phone" placeholder="0621516978" />
        {#if errors?.phone}
        <Helper class={helperClass}> 
            {errors.phone[0]}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label class="ts-text-bold mb-2">
            Role
            <Select name="role" class="mt-2 ts-text text-th-black-light capitalize" placeholder="Liste des roles" items={roleItems} bind:value={roleSelected} />
        </Label>
        {#if errors?.role}
        <Helper class={helperClass}> 
            {errors.role[0]}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label class="ts-text-bold mb-2">
            Équipe
            <Select name="team" class="mt-2 ts-text text-th-black-light capitalize" placeholder="Liste des équipes" items={teamItems} bind:value={teamSelected} />
        </Label>
        {#if errors?.team}
        <Helper class={helperClass}> 
            {errors.team[0]}
        </Helper>
        {/if}
    </div>
    <div class="flex justify-end pb-4 space-x-4 md:px-4">
      <Button type="submit" class={btnClass}>Enregistrer</Button>
    </div>
</form>