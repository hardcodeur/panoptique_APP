<script lang="ts">
  import { Toast } from "flowbite-svelte";
  import { CheckCircleSolid,CloseCircleSolid,FireSolid } from "flowbite-svelte-icons";
  import type { toastStatus } from "$lib/types";

  type typeIcone = typeof CheckCircleSolid | typeof CloseCircleSolid | typeof FireSolid

  let {
    status,
    message
  }: 
  {
    status:toastStatus,
    message:string} 
  = $props();

  const config: Record<toastStatus,{
    toastColor: string,
    icon: typeIcone
    iconColor: string
    dismissable: boolean
  }> = {
    success:{
      toastColor : "text-green-500 border-green-500",
      icon: CheckCircleSolid,
      iconColor:"text-green-500",
      dismissable : true
    },
    error:{
      toastColor :"text-th-red border-th-red",
      icon: CloseCircleSolid,
      iconColor:"text-th-red",
      dismissable : false
    },
    delete:{
      toastColor :"text-red-500 border-red-500",
      icon: FireSolid,
      iconColor:"text-red-500",
      dismissable : true
    },
  }

  const toastConfig = $derived(config[status]);

</script>

<Toast dismissable={toastConfig.dismissable} divClass="flex items-center w-full max-w-xs p-4 gap-3 mb-6 border rounded-md {toastConfig.toastColor}">
  {#snippet icon()}
    {@const IconComponent = toastConfig.icon}
    <IconComponent class="h-6 w-6 {toastConfig.iconColor}" />
  {/snippet}
  {message}
</Toast>