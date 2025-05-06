<script lang="ts">

    let {missionShifts} = $props();

</script>
<div class="w-full p-6 bg-white border border-gray-200 rounded-lg flex mt-4">
    <div class="flex flex-col basis-1/3">
        <div class="flex flex-col items-center justify-center">
            <span>{missionShifts.location}</span>
            <span>{missionShifts.startDateFormat}</span>
            <span>{missionShifts.endDateFormat}</span>
        </div>
    </div>
    <div class="basis-2/3">
        <div class="flex justify-center">
            <span>Mission {missionShifts.id}</span>
        </div>
        <div class="flex items-center justify-center">
            {#if missionShifts.startDateFormat !== missionShifts.endDateFormat}
            <div class="flex items-center justify-center w-full">
                col-1
            </div>
            <div class="flex items-center justify-center w-full">
                col-1
            </div>
            {:else}
            <div class="flex items-center justify-center w-full">
                col-1
            </div>
            {/if}

        </div>
    </div>
</div>