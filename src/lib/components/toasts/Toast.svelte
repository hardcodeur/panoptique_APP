
<script lang="ts">
  import { Toast } from "flowbite-svelte";
  import { InfoCircleSolid } from "flowbite-svelte-icons";
  import { dismissNotification} from "$lib/stores/notificationStore";

  let {id,message} = $props()

</script>

<Toast onclick={() => dismissNotification(id)} divClass="w-full border-th-black-light border max-w p-4 rounded-lg text-th-black bg-th-white gap-3">
  {#snippet icon()}
    <InfoCircleSolid class="text-th-blue rounded-full w-8 h-8" />
  {/snippet}
  <p class="text-th-black ts-text">{message}</p>
</Toast>