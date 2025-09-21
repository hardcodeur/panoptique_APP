<script lang="ts">
    import type { MissionFormComponent, SidebarFormConfig } from '$lib/types';
    import type { ActionData,PageData } from './$types'
    
    import { Tabs, TabItem, Button } from 'flowbite-svelte';
    import { CirclePlusSolid } from 'flowbite-svelte-icons';
    import AccessControl from "$lib/components/AccessControl.svelte";
    import SidebarForm from "$lib/components/sidebar/SidebarForm.svelte";
    import MissionCard from "$lib/components/card/MissionCard.svelte";
    import MissionShiftCard from "$lib/components/card/MissionShiftCard.svelte";
    import LocationCard from "$lib/components/card/LocationCard.svelte";
    import FormLocation from "$lib/components/form/location/FormLocation.svelte";
    import FormMission from "$lib/components/form/mission/FormMission.svelte"
    import FormResponceToast from "$lib/components/toasts/FormResponceToast.svelte";


    type Mission = {
        id: number;
        start: string;
        end: string;
        customer: string;
        product: string;
        location: string;
        address: string;
        team: string;
    };

    // Data from backend
    // - form for the action part 
    // - data for the load part
    let { form,data } : { form: ActionData,data: PageData}  = $props();
 
    let sideBarHidden: boolean = $state(true);
    let sidebarConfig: SidebarFormConfig | null = $state(null);
    
    function sideBarFormConfig(component: MissionFormComponent,sidebarTitle :string, itemUpdate?: any): void {
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

    function groupMissionsByDate(missions: Mission[]) {
        const today = new Date();
        const todayMissions: Mission[] = [];
        const upcomingMissions: Mission[] = [];

        for (const mission of missions) {
            const endDate = new Date(mission.end);            
            const isSameDay = endDate.getDate() === today.getDate() && endDate.getMonth() === today.getMonth() && endDate.getFullYear() === today.getFullYear();
            if (isSameDay) {
            todayMissions.push(mission);
            }else{                
            upcomingMissions.push(mission);
            }
        }

        return {
            today: todayMissions,
            upcoming: upcomingMissions,
        };
    }

    const teamList = $derived(data.teamList);
    const temMemberList = $derived(data.temMemberList);
    const customerList = $derived(data.customerList);
    const locationList = $derived(data.location);
    const missionList = $derived(groupMissionsByDate(data.missionList));
    const user = data.user;

    const tabsTitleMissions="Missions"
    const tabsTitleLocation="Lieux"
    const tabsClass="mt-4";
    const tabItemActiveClass="inline-block ts-text-bold text-center disabled:cursor-not-allowed p-4 text-th-blue border-b-2 border-th-blue active"
    const tabItemInactiveClass="inline-block ts-text text-center disabled:cursor-not-allowed p-4 border-b-2 border-transparent hover:text-th-black text-th-black"
    
    const tabItemTitle="ts-title-2" 
    const tabItemTitleRow="flex flex-col items-center sm:flex-row sm:justify-between gap-4 py-4"
    const btnClass="text-th-white bg-th-blue ts-text-bold"
    const btnIconClass="mr-2"

    const missionListTitleClass="ts-text-title text-th-black-light"

</script>
  
<Tabs contentClass={tabsClass} tabStyle="underline" >
    <!-- Mission -->
    <TabItem open title={tabsTitleMissions} activeClasses={tabItemActiveClass} inactiveClasses={tabItemInactiveClass}>
        {#if (form?.actionName === "missionDelete") && form?.apiReturn && sideBarHidden}
        <div class="flex justify-center items-center">
            <FormResponceToast status={form?.apiReturn.status} message={form?.apiReturn.message} />
        </div>
        {/if}
        <div class={tabItemTitleRow}>
            <h1 class={tabItemTitle}>{tabsTitleMissions}</h1>
            <AccessControl role={user?.role} minRole={"team_manager"} >
            <Button size="sm" class={btnClass} on:click={() => {sideBarFormConfig(FormMission,"Nouvel mission")}}><CirclePlusSolid class={btnIconClass} />Ajouter une mission</Button>
            </AccessControl>
        </div>
        {#if missionList.today.length != 0 || missionList.upcoming.length != 0}
            {#if missionList.today.length != 0}
                <h4 class={missionListTitleClass}>En cours</h4>
                {#each missionList.today as mission}
                    <MissionCard {mission} {sideBarFormConfig}/>
                {/each}
            {/if}
            {#if missionList.upcoming.length != 0}
                <h4 class={missionListTitleClass+" mt-6"}>À venir</h4>
                {#each missionList.upcoming as mission}
                    <MissionCard {mission} {sideBarFormConfig}/>
                {/each}
            {/if}
        {:else}
        <div class="text-center">
            <p class="ts-text-title text-th-red">Pas de mission en vue pour les jours à venir.</p>
        </div>
        {/if}

    </TabItem>
    <!-- Location -->
    <TabItem title={tabsTitleLocation} activeClasses={tabItemActiveClass} inactiveClasses={tabItemInactiveClass}>
        <div class={tabItemTitleRow}>
            <h1 class={tabItemTitle}>{tabsTitleLocation}</h1>
            <AccessControl role={user?.role} minRole={"team_manager"} >
            <Button size="sm" class={btnClass} on:click={() => (sideBarFormConfig(FormLocation,"Nouveau lieu"))}><CirclePlusSolid class={btnIconClass} />Ajouter un lieux</Button>
            </AccessControl>
        </div>
        {#each locationList as location}
        <LocationCard {location} {sideBarFormConfig}/>
        {/each}
        
    </TabItem>
</Tabs>
<SidebarForm bind:hidden={sideBarHidden} formComponentData={{teamList,temMemberList,customerList}} config={sidebarConfig} />