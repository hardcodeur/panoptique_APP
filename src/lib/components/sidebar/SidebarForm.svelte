<script lang="ts">
    import { Section } from "flowbite-svelte-blocks";
    import { Drawer, CloseButton } from "flowbite-svelte";
    import { sineIn } from "svelte/easing";

    let { 
        hidden = $bindable(false),
        formComponent = null,
        componentProps = {}
    } = $props()

    let transitionParams = {
      x: -320,
      duration: 200,
      easing: sineIn
    };
</script>
    
<Section name="crudcreatedrawer">
    <Drawer transitionType="fly" {transitionParams} bind:hidden id="sidebar4">
        <div class="flex items-center">
            <h5 id="drawer-label" class="inline-flex items-center mb-6 text-base font-semibold text-gray-500 uppercase dark:text-gray-400">New Product</h5>
            <CloseButton on:click={() => (hidden = true)} class="mb-4 dark:text-white" />
        </div>
        {#if formComponent}
        {@render formComponent(componentProps)}
        {/if}
    </Drawer>
</Section>