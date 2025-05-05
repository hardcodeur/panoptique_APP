<script lang="ts">

    let {mission} = $props();

</script>
<div class="full-w p-6 bg-white border border-gray-200 rounded-lg flex mt-4">
    <div class="flex flex-col basis-1/3">
        <div class="flex flex-col items-center justify-center">
            <span>Début</span>
            <span>{mission.startDateFormat}</span>
            <span>{mission.startHourFormat}</span>
        </div>
        <div class="flex flex-col items-center justify-center">
            <span>Fin</span>
            <span>{mission.endDateFormat}</span>
            <span>{mission.endtHourFormat}</span>
        </div>
    </div>
    <div class="basis-2/3">
        <div class="flex justify-center">
            <span>Mission {mission.id}</span>
        </div>
        <div class="grid grid-cols-2 gap-4 place-items-center ">
            <span>Durée: {mission.duration}</span>
            <span>Client: {mission.customer}</span>
            <span>Produit: {mission.product}</span>
            <span>Lieu: {mission.location}</span>
            <span>Equipe: {mission.team}</span>
        </div>
    </div>
</div>