<script lang="ts">
    import { Button } from 'flowbite-svelte';
    import { CogSolid } from 'flowbite-svelte-icons';
    import type { ActionData,PageData } from './$types';
    import FormProfil from "$lib/components/form/profil/FormProfil.svelte"

    const titleRowClass="flex justify-between items-center p-4 mt-4"
    const btnClass="ts-text-bold bg-th-red"
    const btnIconClass="mr-1"

    let { form,data } : { form: ActionData,data: PageData}  = $props();

    const handleBtnClick = ()=>{

    }

</script>

<section>
    <div class={titleRowClass}>
        <h1>Profile</h1>
        <Button size="sm" class={btnClass} on:click={handleBtnClick}><CogSolid class={btnIconClass} />Modifier</Button>
    </div>
    <FormProfil {form} formProps="" />
</section>