<script lang="ts">
    import type { ApexOptions } from "apexcharts";
    import { Chart } from "@flowbite-svelte-plugins/chart";

    type ActivityCounts = {
        connexion: number;
        surveillance: number;
        deconnexion: number;
    };

    let {
        activities
    }: {activities: ActivityCounts}= $props();

    const options: ApexOptions = {
    series: [
      {
        name: "Quarts",
        color: "#FF4500",
        data: [
          { x: "Connexion", y: activities.connexion },
          { x: "Surveillance", y: activities.surveillance },
          { x: "Deconnexion", y: activities.deconnexion },
        ]
      }
    ],
    chart: {
      type: "bar",
      height: "150px",
      fontFamily: "Oswald,sans-serif",
      toolbar: {
        show: false
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      style: {
        fontFamily: "Oswald,sans-serif"
      }
    },
    stroke: {
      show: true,
      width: 0,
      colors: ["transparent"]
    },
    dataLabels: {
      enabled: true,
      style: {
        colors : ["#333333"]
      },
      background:{
        enabled: true,
        borderRadius:10,
        padding: 10,
        borderWidth: 0,
      }
    },
    legend: {
      show: false
    },
    yaxis: {
      show: false
    },
    fill: {
      opacity: 1
    }
  };
 

</script>

<div class="border border-th-black-light rounded-lg flex flex-col sm:flex-row mt-10 sm:mt-4">
    <div class="flex flex-col w-full">
        <div class="flex flex-col items-center py-3 gap-4 p-4">
             <Chart {options}/>
            <!-- <span class="ts-text-sub-title border-th-black-light">Connexions <span class="text-th-red ml-5">{activities.connexion}</span></span>
            <span class="ts-text-sub-title border-th-black-light">Surveillances <span class="text-th-red ml-3">{activities.surveillance}</span></span>
            <span class="ts-text-sub-title border-th-black-light">Déconnexions <span class="text-th-red ml-3">{activities.deconnexion}</span></span> -->
        </div>
        <div class="p-4 h-full border-t bg-white rounded-b-lg border-th-black-light">
            <p class="text-th-blue ts-text-sub-title text-center">Répartition des quarts</p>
        </div>
    </div>
</div>
