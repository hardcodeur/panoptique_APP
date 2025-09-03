<script lang="ts">
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    import {Button,Label, Input, Helper,Select,Radio,AccordionItem, Accordion} from "flowbite-svelte";
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
    let formAction: string= $derived(itemUpdate ? `?/userUpdate`: '?/userAdd')

    let firstName= $state("");
    let lastName= $state("");
    let email= $state("");
    let phone= $state("");
    let status= $state("");
    let roleSelected= $state("");
    let teamSelected= $state("");

    // reload component after submit form
    const handleEnhance = ()=>{
        return async ({ result,update }: { result: ActionResult,update:()=>void })=>{
            if (result.type === 'success'){
                await invalidateAll();
            }
            update();
        }
    }

    const teamList = formComponentData.teamList
    
    let roleItems :SelectInputValue[] = [
        { value: 'admin', name: 'Administrateur' },
        { value: 'manager', name: "Directeur d'agence" },
        { value: 'team_manager', name: "Chef d'équipe" },
        { value: 'agent', name: "Agent" },
    ];
    
    let teamItems :SelectInputValue[] = [];
    teamList.forEach(team => {
        teamItems = [...teamItems, { value: team.id, name: team.teamName }];
    });

    
    $effect(()=>{
        // field values
        if (itemUpdate && !submittedData) { // update user         
            firstName= itemUpdate.firstName || '';
            lastName= itemUpdate.lastName || '';
            email= itemUpdate.email || '';
            phone= itemUpdate.phone || '';
            status= itemUpdate.status || '';       
            roleSelected= itemUpdate.role || '';
            teamSelected= itemUpdate.teamId || ''; 
        } else if (submittedData) { // data user return last submited or update in form 
            firstName=  submittedData.firstName || '';
            lastName= submittedData.lastName || '';
            email= submittedData.email || '';
            phone= submittedData.phone || '';
            status= submittedData.status || '';
            roleSelected= submittedData.role || '';
            teamSelected= submittedData.team || String(submittedData.teamId) || '';
        }else{ // default
            firstName= '';
            lastName= '';
            email= '';
            phone= '';
            status= '';
            roleSelected= '';
            teamSelected= '';
        }

    });

    const inputDisabled = (itemUpdate) ? true  : false
    const btnClass="text-center focus-within:ring-4 focus-within:outline-hidden inline-flex items-center justify-center px-5 py-2.5 text-white bg-th-blue hover:bg-primary-800 rounded-lg"
    const helperClass="text-sm text-th-red mt-2"

</script>

<form use:enhance={handleEnhance} method="POST" action={formAction} class="mb-6">
    {#if itemUpdate}
    <input type="hidden" name="userId" value="{itemUpdate.id}">
    {/if}
    <div class="mb-6">
        <Label for="firstName" class="ts-text-bold block mb-2">Nom</Label>
        <Input class="text-th-black border-th-black-light" id="firstName" bind:value={firstName} name="firstName" placeholder="Jean" />
        {#if errors?.firstName}
        <Helper class={helperClass}> 
            {errors.firstName[0]}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label for="lastName" class="ts-text-bold block mb-2">Prénom</Label>
        <Input class="text-th-black border-th-black-light" id="lastName" bind:value={lastName} name="lastName" placeholder="Dupont" />
        {#if errors?.lastName}
        <Helper class={helperClass}> 
            {errors.lastName[0]}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label for="email" class="ts-text-bold block mb-2">Email</Label>
        <Input readonly={inputDisabled} class="text-th-black border-th-black-light" id="email" bind:value={email} name="email" placeholder="j.dupont@sgs.com" />
        {#if errors?.email}
        <Helper class={helperClass}>
            {errors.email[0]}
        </Helper>
        {/if}
    </div>
    {#if itemUpdate}
    <div class="mb-6">
        <p class="ts-text-bold block mb-2">Status</p>
        <ul class="w-full items-center divide-x divide-th-black-light rounded-lg border border-th-black-light sm:flex rtl:divide-x-reverse">
            <li class="w-full"><Radio name=status value="1" bind:group={status} class="p-3">Disponible</Radio></li>
            <li class="w-full"><Radio name=status value="0" bind:group={status} class="p-3">Indisponible</Radio></li>
        </ul>
    </div>
    {/if}
    <div class="mb-6">
        <Label for="phone" class="ts-text-bold block mb-2">Téléphone</Label>
        <Input class="text-th-black border-th-black-light" id="phone" bind:value={phone} name="phone" placeholder="0621516978" />
        {#if errors?.phone}
        <Helper class={helperClass}> 
            {errors.phone[0]}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label class="ts-text-bold mb-2">
            Role
            <Select name="role" class="mt-2 ts-text text-th-black border-th-black-light capitalize" placeholder="Liste des roles" items={roleItems} bind:value={roleSelected} />
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
            <Select name="team" class="mt-2 ts-text text-th-black border-th-black-light capitalize" placeholder="Liste des équipes" items={teamItems} bind:value={teamSelected} />
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
    {#if itemUpdate}
    <Accordion flush >
        <AccordionItem>
            {#snippet header()}Réinitialiser le mot de passe{/snippet}
            <p>Générez un nouveau mot passe pour l'utilisateur.<br>Cela mettra fin à ses sessions actuelles</p>
            <div class="flex justify-end pb-4 space-x-4 md:px-4">
                <form use:enhance method="POST" action="?/userResetPassword" class="mt-3">
                    <input type="hidden" name="userId" value={itemUpdate.id}>
                    <Button type="submit" class="xt-center focus-within:ring-4 focus-within:outline-hidden inline-flex items-center justify-center px-5 py-2.5 text-white bg-th-red hover:bg-primary-800 rounded-lg">Réinitialiser le mot de passe</Button>
                </form>
            </div>
        </AccordionItem>
    </Accordion>
    {/if}
</form>