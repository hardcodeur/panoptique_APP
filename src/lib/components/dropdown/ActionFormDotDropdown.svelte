<script lang="ts">
    import { Dropdown, DropdownItem,Button } from "flowbite-svelte";
    import { DotsHorizontalOutline} from "flowbite-svelte-icons";
    import { invalidateAll } from '$app/navigation';
    import { enhance } from '$app/forms';
    import type { ActionResult } from '@sveltejs/kit';


    let {
        itemId,
        sideBarFormConfig,
        deleteAction,
    }:{
        itemId : string,
        sideBarFormConfig : any, // modifier bon type
        deleteAction: string
    }=$props()

    const handleEnhance = ()=>{
        return async ({ result,update }: { result: ActionResult,update:()=>void })=>{
            if (result.type === 'success'){
                await invalidateAll();
            }
            update();
        }
    }
</script>

<DotsHorizontalOutline size="lg" class="dots-menu-{itemId}" />
<Dropdown triggeredBy=".dots-menu-{itemId}">
  <DropdownItem class="px-3 ts-text-bold py-1" on:click={() => (sideBarFormConfig)}>Modifier</DropdownItem>
  <DropdownItem class="w-full p-0">
    <form use:enhance={handleEnhance} method="POST" action={deleteAction} class="mt-3">
        <input type="hidden" name="teamId" value={itemId}>
        <Button type="submit" class="xt-center focus-within:ring-0 px-3 py-1 ts-text-bold text-th-red hover:text-primary-800 rounded-lg">Supprimer l'équipe</Button>
    </form>
  </DropdownItem>
</Dropdown>