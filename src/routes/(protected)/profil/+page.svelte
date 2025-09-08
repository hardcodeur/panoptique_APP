<script lang="ts">
    import type { ActionData,PageData } from './$types';
    import type { ProfilFormComponent, SidebarFormConfig } from '$lib/types';
    
    import { Button } from 'flowbite-svelte';
    import { CogSolid } from 'flowbite-svelte-icons';
    import { UserSolid,MailBoxSolid,GraduationCapSolid,PhoneSolid} from 'flowbite-svelte-icons';
    
    import SidebarForm from "$lib/components/sidebar/SidebarForm.svelte";
    import FormProfil from "$lib/components/form/profil/FormProfil.svelte"
    import FormChangePassword from "$lib/components/form/profil/FormChangePassword.svelte";

    
    type RoleKey = 'admin' | 'manager' | 'team_manager' | 'agent';
    const roles: Record<RoleKey, string> = {
        admin: "Administrateur",
        manager: "Directeur d'agence",
        team_manager: "Chef d'équipe",
        agent: "Agent"
    };
    
    let { form,data } : { form: ActionData,data: PageData}  = $props();
    
    let sideBarHidden: boolean = $state(true);
    let sidebarConfig: SidebarFormConfig | null = $state(null);
    
    const profil = $derived(data.profil);
    
    const getRoleLabel = (role: string): string => {
        return roles[role as RoleKey];
    };

    
    function sideBarFormConfig(component: ProfilFormComponent,sidebarTitle :string, itemUpdate?: any): void {
        // to delay updating the component until last (no conflict)
        setTimeout(()=>{
            sideBarHidden = false; // trigger show/hidden
            sidebarConfig = {
                title: sidebarTitle,
                component: component,
                formReturn: form, // form error and data in form send
                itemUpdate: itemUpdate // item to update in form
            };
            form = null // reset form
        },0)
    }

    // Dynamic zod form error return
    $effect(() => {
        if (sidebarConfig) {
            sidebarConfig.formReturn = form;
        }
    });

    const cardClass="max-full border border-th-black-light rounded-lg mt-4 text-th-black";
    const cartTitle="text-th-blue ts-text-title";;
    const cardTitleRowClass="flex p-4 justify-between items-center border-b border-th-black-light";
    const cardContend="flex flex-col p-4"
    const iconClass="mr-1"
    const dataRowClass="flex justify-start items-center text-th-black ts-text-bold"
    const dataClass="ml-1 ts-text"
    const btnClass="ts-text-bold bg-th-red"
    const btnIconClass="mr-1"

</script>

<section>
    <div class={cardClass} >
        <div class={cardTitleRowClass}>
            <h2 class={cartTitle}>Profil</h2>
        </div>
        <div class={cardContend}>
            <span class={dataRowClass}><UserSolid class={iconClass}/>Nom:<span class={dataClass}>{profil.firstName} {profil.lastName}</span></span>
            <span class={dataRowClass}><MailBoxSolid class={iconClass}/>Email:<span class={dataClass}>{profil.email}</span></span>
            <span class={dataRowClass}><GraduationCapSolid class={iconClass}/>Fonction:<span class={dataClass}>{getRoleLabel(profil.roles)}</span></span>
        </div>
    </div>
    <div class={cardClass}>
        <div class={cardTitleRowClass}>
            <h2 class={cartTitle}>Données personnelles</h2>
            <Button size="sm" class={btnClass} on:click={() => {sideBarFormConfig(FormProfil,"Modifier mes données personnel",profil)}}><CogSolid class={btnIconClass} />Modifier</Button>
        </div>
        <div class={cardContend}>
            <span class={dataRowClass}><PhoneSolid class={iconClass}/>Téléphone:<span class={dataClass}>{profil.phone}</span></span>
        </div>
    </div>
    <div class={cardClass}>
        <div class={cardTitleRowClass}>
            <h2 class={cartTitle}>Mot de passe</h2>
        </div>
        <div class={cardContend}>
            <Button size="lg" class={btnClass} on:click={() => {sideBarFormConfig(FormChangePassword,"Modifier mon mot de passe",profil)}}><CogSolid class={btnIconClass} />Modifier</Button>
        </div>
    </div>
    <SidebarForm bind:hidden={sideBarHidden} formComponentData={{}} config={sidebarConfig} />
</section>