<script lang="ts">

    let {
        shifts
    }= $props();

    let shiftList=$derived(shifts);

</script>

<div class="border border-th-black-light rounded-lg flex flex-col sm:flex-row mt-10 sm:mt-4">
    <div class="flex flex-col w-full">
        {#if shiftList.length !== 0 }
        <div class="flex flex-col p-4">
            {#each shiftList as shift}
            <div class="flex flex-col items-center sm:justify-start sm:flex-row py-3 gap-4 border-b border-th-black-light xl:justify-around">
                <span class="ts-text-bold text-th-blue">{shift.shiftStartDateFormat}</span>
                <span class="capitalize">{shift.activity}</span>
                <span class="ts-text-bold text-th-blue">{shift.shiftStartHourFormat} - {shift.shiftEndHourFormat}</span>
                <span>Mission <span class="text-th-red">{shift.missionId}</span></span>
            </div>
            {/each}
        </div>
        {:else}
        <div class="p-8 text-center">
            <p class="ts-text-bold">Aucune périodes de travail</p>
        </div>
        {/if}
        
        <div class="p-4 h-full border-t bg-white rounded-b-lg border-th-black-light">
            <p class="text-th-blue ts-text-sub-title text-center">Mes périodes de travail cette semaine</p>
        </div>
    </div>
</div>
