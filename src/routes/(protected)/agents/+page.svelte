<script lang="ts">
    import { Tabs, TabItem, Button } from 'flowbite-svelte';
    import { CirclePlusSolid } from 'flowbite-svelte-icons';
    import SidebarForm from "$lib/components/sidebar/SidebarForm.svelte";
    import FormAgent from "$lib/components/form/agents/FormAgent.svelte"
    import FormTeam from "$lib/components/form/Team/FormTeam.svelte"
    import TableUser from "$lib/components/tables/TableUser.svelte";
    import TeamCard from "$lib/components/card/TeamCard.svelte";
    import FormResponceToast from "$lib/components/toasts/FormResponceToast.svelte";
    import AccessControl from "$lib/components/AccessControl.svelte";
    import type { ActionData,PageData } from './$types';
    import type { AgentFormComponent, SidebarFormConfig } from '$lib/types';

    // Data from backend
    // - form for the action part 
    // - data for the load part
    let { form,data } : { form: ActionData,data: PageData}  = $props();

 
    let sideBarHidden: boolean = $state(true);
    let sidebarConfig: SidebarFormConfig | null = $state(null);

    function sideBarFormConfig(component: AgentFormComponent,sidebarTitle :string, itemUpdate?: any): void {
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

    const tabsTitleAgent="Agents"
    const tabsTitleTeam="Équipes"

    const tabsClass="mt-4";
    const tabItemTitleRow="flex flex-col items-center sm:flex-row sm:justify-between gap-4 py-4"
    const tabItemActiveClass="inline-block ts-text-bold text-center disabled:cursor-not-allowed p-4 text-th-blue border-b-2 border-th-blue active"
    const tabItemInactiveClass="inline-block ts-text text-center disabled:cursor-not-allowed p-4 border-b-2 border-transparent hover:text-th-black text-th-black"
    const btnClass="text-th-white bg-th-blue ts-text-bold"
    const btnIconClass="mr-2"
    const tabItemTitle="ts-title-2" 

    const teamList = $derived(data.teamList);
    const userList = $derived(data.userList);
    const teamsUsers = $derived(data.teamWhiteUsers);
    const user = data.user;

</script>
  
<Tabs contentClass={tabsClass} tabStyle="underline" >
    <TabItem open title={tabsTitleAgent} activeClasses={tabItemActiveClass} inactiveClasses={tabItemInactiveClass}>
        {#if (form?.actionName === "resetPassword" || form?.actionName === "userDelete") && form?.apiReturn && sideBarHidden}
        <div class="flex justify-center items-center">
            <FormResponceToast status={form?.apiReturn.status} message={form?.apiReturn.message} />
        </div>
        {/if}
        <div class={tabItemTitleRow}>
            <h1 class={tabItemTitle}>{tabsTitleAgent}</h1>
            <Button size="lg" class={btnClass} on:click={() => {sideBarFormConfig(FormAgent,"Nouvel agent")}}><CirclePlusSolid class={btnIconClass} />Ajouter un agent</Button>
        </div>
        <TableUser {userList} sideBarFormConfig={sideBarFormConfig} />
    </TabItem>
    <AccessControl role={user?.role} minRole={"manager"} >
    <TabItem title={tabsTitleTeam} activeClasses={tabItemActiveClass} inactiveClasses={tabItemInactiveClass}>
        {#if form?.actionName === "teamDelete" && form?.apiReturn && sideBarHidden}
        <div class="flex justify-center items-center">
            <FormResponceToast status={form?.apiReturn.status} message={form?.apiReturn.message} />
        </div>
        {/if}
        <div class={tabItemTitleRow}>
            <h1 class={tabItemTitle}>{tabsTitleTeam}</h1>
            <Button size="lg" class={btnClass} on:click={() => {sideBarFormConfig(FormTeam,"Nouvelle équipe")}}><CirclePlusSolid class={btnIconClass} />Ajouter une équipe</Button>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-x-8 gap-y-4">
            {#each teamsUsers as teamUsers}
                <TeamCard teamId={teamUsers.id} teamName={teamUsers.teamName} users={teamUsers.users} sideBarFormConfig={sideBarFormConfig}/>
            {/each}
        </div>
    </TabItem>
    </AccessControl>
</Tabs>
<SidebarForm bind:hidden={sideBarHidden} formComponentData={{teamList,user}} config={sidebarConfig} />