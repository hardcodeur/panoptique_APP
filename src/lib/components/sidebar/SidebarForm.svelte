<script lang="ts">
    import type { SidebarFormConfig,ApiReturn } from '$lib/types';
    import { Section } from "flowbite-svelte-blocks";
    import { Drawer, CloseButton } from "flowbite-svelte";
    import { sineIn } from "svelte/easing";
    import FormResponceToast from "$lib/components/toasts/FormResponceToast.svelte";

    let { 
        hidden = $bindable(false),
        formComponentData,
        config,
    } : { 
        hidden: boolean; 
        formComponentData: any; 
        config: SidebarFormConfig | null 
    } = $props();


    let sidbarTitle: string | undefined = $derived(config?.title);
    let FormComponent = $derived(config?.component);
    let toastResponce: ApiReturn | undefined = $derived(config?.formReturn?.apiReturn);

    let transitionParams = {
      x: 320,
      duration: 200,
      easing: sineIn
    };
</script>
    
<Section name="default">
    <Drawer transitionType="fly" width="w-110" placement="right" {transitionParams} bind:hidden id="crudForm">
        <div class="flex items-center">
            <h5 id="drawer-label" class="inline-flex items-center mb-6 text-base font-semibold text-gray-500 uppercase dark:text-gray-400">{sidbarTitle}</h5>
            <CloseButton on:click={() => (hidden = true)} class="mb-4 dark:text-white" />
        </div>
        {#if toastResponce}
        <div class="flex justify-center items-center">
            <FormResponceToast status={toastResponce.status} message={toastResponce.message} />
        </div>
        {/if}
        {#if FormComponent && config}
            <FormComponent formReturn={config.formReturn} {formComponentData} itemUpdate={config.itemUpdate} />
        {/if}
    </Drawer>
</Section>