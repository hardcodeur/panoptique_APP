<script lang="ts">
    import { ClockSolid,UserSolid,LabelSolid,MapPinAltSolid,UsersGroupSolid } from 'flowbite-svelte-icons';
    import ActionFormDotDropdown from "$lib/components/dropdown/ActionFormDotDropdown.svelte";
    import FormMission from "$lib/components/form/mission/FormMission.svelte";
    import UserBadge from "$lib/components/badge/UserBadge.svelte";
    import AccessControl from "$lib/components/AccessControl.svelte";
    
    let {
        mission,
        userRole,
        sideBarFormConfig
    } = $props();


    const dateTitleClass="text-th-black-light ts-text-bold";
    const dateClass="text-th-blue ts-text-string ts-text-title";
    const hourClass="text-th-red ts-text-strong ts-text-title";

    const dataClass="ts-text-sub-title flex flex-row justify-start items-center"
    const iconClass="mr-2"

    const deleteMsg = "Êtes-vous sûr de vouloir supprimer cette mission ? Cette action est irréversible et entraînera la suppression de tous les quarts qui lui sont rattachés."

</script>
<div class="full-w border border-th-black-light rounded-lg flex flex-col lg:flex-row mt-10 lg:mt-4">
    <div class="flex-auto">
        <div class="flex justify-end py-2 pr-4">
            <AccessControl role={userRole} minRole={"team_manager"} >
                <ActionFormDotDropdown alertMsg={deleteMsg} deleteAction="?/missionDelete" itemId={mission.id} sideBarFormConfig={() => sideBarFormConfig(FormMission,`Mission - ${mission.id}`,mission)} />
            </AccessControl>
        </div>
        <div class="flex justify-center p-4 lg:p-8">
            <span class="ts-title-2">Mission <span class="text-th-red">{mission.id}</span></span>
        </div>
        <div class="flex flex-col items-center sm:items-start justify-center gap-4 py-4 sm:flex-row lg:items-start sm:flex-wrap sm:gap-25">
            <div class="flex flex-col gap-4">
                <span class={dataClass}><ClockSolid size="lg" class={iconClass} />Durée: <span class="ml-2 uppercase">{mission.duration}</span></span>
                <span class={dataClass}><UserSolid size="lg" class={iconClass} />Client: <span class="ml-2 capitalize">{mission.customer}</span></span>
                <span class={dataClass}><LabelSolid size="lg" class={iconClass} />Produit: <span class="ml-2 capitalize">{mission.product}</span></span>
            </div>
            <div class="flex flex-col gap-4">
                <span class={dataClass}><MapPinAltSolid size="lg" class={iconClass} />Lieu: <span class="ml-2 capitalize">{mission.location}</span></span>
                <span class={dataClass}><UsersGroupSolid size="lg" class={iconClass} />Equipe: <span class="ml-2 capitalize">{mission.team}</span></span>
            </div>
        </div>
        {#if mission.shifts.length > 0}   
        <hr class="border-th-black-light my-4">       
        <p class="text-center ts-title-2 mt-4">Quarts</p>  
        <div class="flex items-center justify-center">
            <div class="h-full w-full sm:justify-center flex flex-col sm:flex-row items-center sm:items-start  py-8 flex-wrap">
                {#each mission.shifts as shift}
                <div class="flex flex-col items-center justify-center ts-text gap-4 py-4 sm:px-3 border-b lg:border-b-0 lg:border-r border-th-black-light">
                    <span class="text-th-black ts-text-bold">{shift.startDateFormat}</span>
                    <span class="text-th-black-light ">{shift.activity}</span>
                    <div class="flex flex-col gap-4 items-center">
                        <span class="text-th-black ts-text-bold">{shift.startHourFormat}</span>
                        {#each shift.users as user}
                        <UserBadge userName={user.userFullname} role={user.userRole} />
                        {/each}
                    </div>
                </div>
                {/each}
            </div>
        </div>
        {:else}
        <div class="text-center my-8">
            <p class="ts-text-title text-th-red">Aucun quart de défini</p>
        </div>
        {/if}
        <div class="flex flex-col sm:flex-row sm:justify-around sm:border-t flex-none bg-white border-th-black-light">
            <div class="flex flex-col items-center justify-center p-4 border-y sm:border-y-0 sm:border-r  w-full  border-th-black-light gap-2">
                <span class={dateTitleClass}>Début</span>
                <span class={dateClass}>{mission.startDateFormat}</span>
                <span class={hourClass}>{mission.startHourFormat}</span>
            </div>
            <div class="flex flex-col items-center justify-center p-4 gap-2 sm:border-none  w-full border-th-black-light">
                <span class={dateTitleClass}>Fin</span>
                <span class={dateClass}>{mission.endDateFormat}</span>
                <span class={hourClass}>{mission.endHourFormat}</span>
            </div>
        </div>
    </div>
</div>