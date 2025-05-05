<script lang="ts">
    import { Button } from 'flowbite-svelte';
    import { CogSolid } from 'flowbite-svelte-icons';
    import SidebarForm from "$lib/components/sidebar/SidebarForm.svelte";
    import type { ActionData,PageData } from './$types';
    import type {  SvelteComponent } from 'svelte';
    import FormProfil from "$lib/components/form/profil/FormProfil.svelte"

    const titleRowClass="flex justify-between items-center mt-4"
    const btnClass="ts-text-bold bg-th-red"
    const btnIconClass="mr-1"

    let { form,data } : { form: ActionData,data: PageData}  = $props();

    type RoleKey = 'admin' | 'manager' | 'team_manager' | 'agent';
    const roles: Record<RoleKey, string> = {
        admin: "Administrateur",
        manager: "Directeur d'agence",
        team_manager: "Chef d'équipe",
        agent: "Agent"
    };
    
    const profil = data.profil;

    const getRoleLabel = (role: string): string => {
        return roles[role as RoleKey];
    };

    
    let drawerHidden: boolean = $state(true);
    let FormComponent = FormProfil;
    let sidbarTitle :string = $state("");
    function openDrawer(DrawerTitle :string): void {
        drawerHidden = false;
        sidbarTitle = DrawerTitle
    }
</script>

<section>
    <div class={titleRowClass}>
        <h1>Profile</h1>
    </div>
    <div class="flex flex-col mt-4">
        <span>{profil.firstName} {profil.lastName}</span>
        <span>{profil.email}</span>
        <span>{getRoleLabel(profil.roles)}</span>
    </div>
    <div class="flex flex-col mt-4">
        <div class={titleRowClass}>
            <h2>Données personnel</h2>
            <Button size="sm" class={btnClass} on:click={() => {openDrawer("Modifier mes données personnel")}}><CogSolid class={btnIconClass} />Modifier</Button>
        </div>
        <span>{profil.phone}</span>
    </div>
    <SidebarForm bind:hidden={drawerHidden} formProps="" {sidbarTitle} {form} {FormComponent} />
</section>