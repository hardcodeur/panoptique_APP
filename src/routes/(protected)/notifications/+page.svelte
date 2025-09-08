<script lang="ts">
    import type { PageData } from './$types'
    import Toast from "$lib/components/toasts/Toast.svelte";
    import { notificationList,loadNotifications} from "$lib/stores/notificationStore";

    let { data } : { data: PageData}  = $props();
    //Store
    loadNotifications(data.notifications);

</script>
<h1 class="ts-title-1 mb-5">Notifications</h1>
{#if $notificationList.length != 0}
    <div class="flex flex-col gap-4">
    {#each $notificationList as notification}
        <Toast id={notification.id} message={notification.text} />
    {/each}
    </div>
{/if}

