<script lang="ts">
  import { Toast } from "flowbite-svelte";
  import { CheckCircleSolid,CloseCircleSolid,FireSolid } from "flowbite-svelte-icons";

  type typeStatus = "success"|"error"|"delete"; 
  type typeIcone = typeof CheckCircleSolid | typeof CloseCircleSolid | typeof FireSolid

  let {
    status,
    message
  }: 
  {
    status:typeStatus,
    message:string} 
  = $props();

  const config: Record<typeStatus,{
    toastColor: string,
    icon: typeIcone
    iconColor: string
  }> = {
    success:{
      toastColor : "text-green-500 border-green-500",
      icon: CheckCircleSolid,
      iconColor:"text-green-500",
    },
    error:{
      toastColor :"text-th-red border-th-red",
      icon: CloseCircleSolid,
      iconColor:"text-th-red",
    },
    delete:{
      toastColor :"text-red-500 border-red-500",
      icon: FireSolid,
      iconColor:"text-red-500",
    },
  }

  const toastConfig = $derived(config[status]);

</script>

<Toast dismissable={false} divClass="flex items-center w-full max-w-xs p-4 gap-3 mb-6 border rounded-md {toastConfig.toastColor}">
  {#snippet icon()}
    {@const IconComponent = toastConfig.icon}
    <IconComponent class="h-6 w-6 {toastConfig.iconColor}" />
  {/snippet}
  {message}
</Toast>