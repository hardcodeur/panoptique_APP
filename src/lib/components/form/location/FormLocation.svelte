<script lang="ts">
    import type { SelectInputValue } from "$lib/types"
    import { enhance } from '$app/forms';
    import { CloseCircleSolid } from 'flowbite-svelte-icons';
    import { Button, Label, Input, Helper, Select, Textarea } from "flowbite-svelte";
    import type { ActionData } from './$types';

    type dynamicFieldNote = {
        id: number;
        title: string;
        note: string;
    };

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

    // input State
    let name = $state("");
    let address = $state("");
    let teamSelected = $state("");

    // Champs dynamiques (notes)
    let dynamicFields = $state<Array<dynamicFieldNote>>(
        formReturn?.formData?.notes?.map((note, index) => ({
        id: index,
        title: note.title || '',
        note: note.content || ''
    })) || []);

    let nextId = $state(dynamicFields.length > 0 ? Math.max(...dynamicFields.map(f => f.id)) + 1 : 0);

    // Team list
    const teamList = formComponentData.teamList;
    let teamItems :SelectInputValue[] = $state([]);
    teamList.forEach(team => {
        teamItems = [...teamItems, { value: team.id, name: team.teamName }];
    });


    // Fonctions pour gérer les champs dynamiques
    const addField = () => {
        dynamicFields = [...dynamicFields, {
            id: nextId++,
            title: '',
            note: ''
        }];
    };

    const removeField = (id: number) => {
        dynamicFields = dynamicFields.filter(field => field.id !== id);
    };

    const btnClass = "text-center focus-within:ring-4 focus-within:outline-hidden inline-flex items-center justify-center px-5 py-2.5 text-white bg-th-blue hover:bg-primary-800 rounded-lg";
    const helperClass = "flex flex-col text-sm text-th-red mt-2";

</script>

<form use:enhance method="POST" action={formAction} class="mb-6">
    <!-- Champs fixes -->
    <div class="mb-6">
        <Label for="name" class="ts-text-bold block mb-2">Nom courant du lieu</Label>
        <Input class="text-th-black border-th-black-light ts-text" id="name" bind:value={name} name="name" required />
        {#if errors?.name}
        <Helper class={helperClass}> 
            {errors.name[0]}
        </Helper>
        {/if}
    </div>

    <div class="mb-6">
        <Label for="address" class="ts-text-bold block mb-2">Adresse complète</Label>
        <Input class="text-th-black border-th-black-light ts-text" id="address" bind:value={address} name="address" required />
        {#if errors?.address}
        <Helper class={helperClass}>
            {errors.address[0]}
        </Helper> 
        {/if}
    </div>

    <div class="mb-6">
        <Label class="ts-text-bold mb-2">
            Équipe
            <Select name="team" class="mt-2 ts-text text-th-black border-th-black-light ts-text capitalize" placeholder="Liste des équipes" items={teamItems} bind:value={teamSelected} required />
        </Label>
        {#if errors?.team}
        <Helper class={helperClass}>
            {errors.team[0]}
        </Helper>
        {/if}
    </div>
    <!-- Champs dynamiques pour les notes -->
    <div class="mb-6">
        <Label class="ts-text-bold block mb-2">Notes</Label>
        {#each dynamicFields as field, i (field.id)}
            <div class="mb-6 p-4 border border-th-black-light rounded-lg relative">
                <button type="button" onclick={() => removeField(field.id)} class="absolute top-2 right-2 text-th-red hover:text-red-700 text-xl" title="Supprimer cette note">
                    <CloseCircleSolid class="fill-th-red" size="lg"/>
                </button>
                <div class="mb-4">
                    <Label for={`title-${field.id}`} class="ts-text-bold block mb-2">Titre</Label>
                    <Input id={`title-${field.id}`} class="text-th-black border-th-black-light ts-text" bind:value={field.title} name={`notes[${i}].title`} required />
                    {#if errors?.notes?.[i]?.title}
                    <Helper class={helperClass}>
                        {errors.notes[i].title[0]}
                    </Helper>
                    {/if}
                </div>
                
                <div class="mb-4">
                    <Label for={`note-${field.id}`} class="ts-text-bold block mb-2">Contenu</Label>
                    <Textarea id={`note-${field.id}`} class="text-th-black border-th-black-light ts-text"  bind:value={field.note} name={`notes[${i}].content`} rows={4} required />
                    {#if errors?.notes?.[i]?.content}
                    <Helper class={helperClass}>
                        {errors.notes[i].content[0]}
                    </Helper>
                    {/if}
                </div>
            </div>
        {/each}
        
        <div class="flex justify-end pb-4 space-x-4 md:px-4">
            <Button type="button" onclick={addField} class="ts-text-bold border focus-within:ring-0 border-th-red text-th-red hover:text-th-white hover:bg-th-red">
                Ajouter une Note
            </Button>
        </div>
    </div>

    <div class="flex justify-end pb-4 space-x-4 md:px-4">
        <Button type="submit" class={btnClass}>Enregistrer</Button>
    </div>
</form>