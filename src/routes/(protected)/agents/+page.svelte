<script lang="ts">
    import { Tabs, TabItem, Button } from 'flowbite-svelte';
    import { CirclePlusSolid } from 'flowbite-svelte-icons';
    import SidebarForm from "$lib/components/sidebar/SidebarForm.svelte";
    import FormAgent from "$lib/components/form/agents/FormAgent.svelte"
    import FormTeam from "$lib/components/form/Team/FormTeam.svelte"
    import TableUser from "$lib/components/tables/TableUser.svelte";
    import TeamCard from "$lib/components/card/TeamCard.svelte"
    import type { ActionData,PageData } from './$types';
    import type { AgentFormComponent, SidebarFormConfig } from '$lib/types';

    // Data from backend
    let { form,data } : { form: ActionData,data: PageData}  = $props();
 
    let sideBarHidden: boolean = $state(true);
    let sidebarConfig: SidebarFormConfig | null = $state(null);

    function sideBarFormConfig(component: AgentFormComponent,sidebarTitle :string, itemUpdate?: any): void {
        sideBarHidden = false; // trigger show/hidden
        sidebarConfig = {
            title: sidebarTitle,
            component: component,
            formReturn: form,
            itemUpdate: itemUpdate

        };
        form = null
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

    const userList=data.userList;
    const teamList = data.teamList
    const teamsUsers = data.teamWhiteUsers;
    const unassignedUsers=data.teamUnassignedUsers;

    const formData = {
        teamList,
        teamsUsers,
        unassignedUsers
    } 

</script>
  
<Tabs contentClass={tabsClass} tabStyle="underline" >
    <TabItem open title={tabsTitleAgent} activeClasses={tabItemActiveClass} inactiveClasses={tabItemInactiveClass}>
        <div class={tabItemTitleRow}>
            <h1 class={tabItemTitle}>{tabsTitleAgent}</h1>
            <Button size="lg" class={btnClass} on:click={() => {sideBarFormConfig(FormAgent,"Nouvel agent")}}><CirclePlusSolid class={btnIconClass} />Ajouter un agent</Button>
        </div>
        <TableUser userList={userList}  sideBarFormConfig={sideBarFormConfig} />
    </TabItem>
    <TabItem title={tabsTitleTeam} activeClasses={tabItemActiveClass} inactiveClasses={tabItemInactiveClass}>
        <div class={tabItemTitleRow}>
            <h1 class={tabItemTitle}>{tabsTitleTeam}</h1>
            <Button size="lg" class={btnClass} on:click={() => {sideBarFormConfig(FormTeam,"Nouvelle équipe")}}><CirclePlusSolid class={btnIconClass} />Ajouter une équipe</Button>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-x-8 gap-y-4">
            {#each teamsUsers as teamUsers (teamUsers.id)}
                <TeamCard teamName={teamUsers.teamName} users={teamUsers.users} sideBarFormConfig={sideBarFormConfig}/>
            {/each}
        </div>
    </TabItem>
</Tabs>
<SidebarForm bind:hidden={sideBarHidden} {formData} config={sidebarConfig} />