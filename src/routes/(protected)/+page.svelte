<script lang="ts">
import WeekShiftWidget from "$lib/components/widget/WeekShiftWidget.svelte";
import AchivmentWidget from "$lib/components/widget/AchivmentWidget.svelte";
import MonthShiftsMetricWidget from "$lib/components/widget/MonthShiftsMetricWidget.svelte";
import type { PageData } from './$types';

let { data } : { data: PageData}  = $props();

const user = $derived(data.user);
const weekShifts = $derived(data.currentWeekShifts.shifts);
const shiftMetric = $derived(data.currentMonthShiftsMetric);
const shiftMetricActivities=$derived(shiftMetric.activitiesCount);
</script>

<div class="py-4">
    <h1 class="ts-title-2 text-th-red">Bonjour, {user?.fullName}</h1>
</div>
<div class="flex flex-col gap-4">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AchivmentWidget value={shiftMetric.totalHours} text="Nombre d’heures effectuées ce mois-ci" />
        <AchivmentWidget value={shiftMetric.totalShifts} text="Total des quarts travaillés ce mois-ci" />
        <MonthShiftsMetricWidget activities={shiftMetricActivities}/>
        <WeekShiftWidget shifts={weekShifts} />
    </div>
</div>