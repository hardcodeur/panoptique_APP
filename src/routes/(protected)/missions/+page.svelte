<script lang="ts">
    import { Tabs, TabItem, Button } from 'flowbite-svelte';
    import { CirclePlusSolid } from 'flowbite-svelte-icons';
    import type { ActionData,PageData } from './$types'
	import type {  ComponentType } from 'svelte';
    import SidebarForm from "$lib/components/sidebar/SidebarForm.svelte";
    import MissionCard from "$lib/components/card/MissionCard.svelte";
    import MissionShiftCard from "$lib/components/card/MissionShiftCard.svelte";

    import FormAgent from "$lib/components/form/agents/FormAgent.svelte"

    let { form,data } : { form: ActionData,data: PageData}  = $props();
 
    let drawerHidden: boolean = $state(true);
    let FormComponent: ComponentType = $state(FormAgent);
    let sidbarTitle :string = $state("");

    function openDrawer(component: ComponentType,DrawerTitle :string): void {
        FormComponent = component;
        drawerHidden = false;
        sidbarTitle = DrawerTitle
    }

    const missionList = data.missionList;
    const missionShiftsList = data.missionShifts;

    const tabsTitleMissions="Missions"
    const tabsTitleShift="Quarts"
    const tabsTitleLocation="Lieux"
    const tabsClass="mt-4";
    
    const tabItemTitleRow="flex justify-between items-center"
    const btnClass="ts-text-bold bg-th-red"
    const btnIconClass="mr-1"

</script>
  
<Tabs contentClass={tabsClass} tabStyle="underline" >
    <TabItem open title={tabsTitleMissions}>
        <div class={tabItemTitleRow}>
            <h1>{tabsTitleMissions}</h1>
            <Button size="sm" class={btnClass} on:click={() => {openDrawer(FormAgent,"Nouvel agent")}}><CirclePlusSolid class={btnIconClass} />Ajouter un agent</Button>
        </div>
        {#each missionList as mission}
            <MissionCard {mission}/>
        {/each}
    </TabItem>
    <TabItem title={tabsTitleShift}>
        <div class={tabItemTitleRow}>
            <h1>{tabsTitleShift}</h1>
            <Button size="sm" class={btnClass} on:click={() => (openDrawer(FormAgent,"Nouvelle équipe"))}><CirclePlusSolid class={btnIconClass} />Ajouter une équipe</Button>
        </div>
        {#each missionShiftsList as missionShifts}
        <MissionShiftCard {missionShifts}/>
        {/each}
    </TabItem>
    <TabItem title={tabsTitleLocation}>
        <div class={tabItemTitleRow}>
            <h1>{tabsTitleLocation}</h1>
            <Button size="sm" class={btnClass} on:click={() => (openDrawer(FormAgent,"Nouvelle équipe"))}><CirclePlusSolid class={btnIconClass} />Ajouter une équipe</Button>
        </div>
    </TabItem>
</Tabs>
<SidebarForm bind:hidden={drawerHidden} formProps="" {sidbarTitle} {form} {FormComponent} />