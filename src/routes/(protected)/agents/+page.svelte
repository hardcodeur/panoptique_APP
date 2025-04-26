<script lang="ts">
    import { Tabs, TabItem, Button } from 'flowbite-svelte';
    import { CirclePlusSolid } from 'flowbite-svelte-icons';
    import SidebarForm from "$lib/components/sidebar/SidebarForm.svelte";
    import FormAgent from "$lib/components/form/agents/FormAgent.svelte"
    import FormTeam from "$lib/components/form/Team/FormTeam.svelte"
    import TableUser from "$lib/components/tables/TableUser.svelte";
    import type { ActionData,PageData } from './$types';
    import { resetUserSelectedStore } from "$lib/stores/form/agentStore";
	import type {  ComponentType } from 'svelte';

    let { form,data } : { form: ActionData,data: PageData}  = $props();
 
    let drawerHidden: boolean = $state(true);
    let FormComponent: ComponentType = $state(FormAgent);
    let sidbarTitle :string = $state("");

    function openDrawer(component: ComponentType,DrawerTitle :string): void {
        FormComponent = component;
        drawerHidden = false;
        sidbarTitle = DrawerTitle
        form = null
    }

    let tabsTitleAgent="Agents"
    let tabsTitleTeam="Équipes"
    let tabsClass="p-4 mt-4'";
    let tabItemTitleRow="flex justify-between items-center"
    let btnClass="ts-text-bold bg-th-red"
    let btnIconClass="mr-1"

</script>
  
<Tabs contentClass={tabsClass} tabStyle="underline" >
    <TabItem open title={tabsTitleAgent}>
        <div class={tabItemTitleRow}>
            <h1>{tabsTitleAgent}</h1>
            <Button size="sm" class={btnClass} on:click={() => {openDrawer(FormAgent,"Nouvel agent"),resetUserSelectedStore()}}><CirclePlusSolid class={btnIconClass} />Ajouter un agent</Button>
        </div>
        <div class="">
            <TableUser userList={data.userList}  openDrawer={openDrawer} />
        </div>
    </TabItem>
    <TabItem title={tabsTitleTeam}>
        <div class={tabItemTitleRow}>
            <h1>{tabsTitleTeam}</h1>
            <Button size="sm" class={btnClass} on:click={() => (openDrawer(FormTeam,"Nouvelle équipe"))}><CirclePlusSolid class={btnIconClass} />Ajouter une équipe</Button>
        </div>
    </TabItem>
</Tabs>
<SidebarForm bind:hidden={drawerHidden} {sidbarTitle} {form} {FormComponent} />