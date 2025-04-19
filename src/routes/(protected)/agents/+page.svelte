<script lang="ts">
    import { Tabs, TabItem, Button } from 'flowbite-svelte';
    import SidebarForm from "$lib/components/sidebar/SidebarForm.svelte";
    import FormAgent from "$lib/components/form/agents/FormAgent.svelte"
    import FormTeam from "$lib/components/form/Team/FormTeam.svelte"
    import type { ActionData } from './$types';
	import type {  ComponentType } from 'svelte';

    let { form } : { form: ActionData }  = $props();

    let drawerHidden: boolean = $state(true);
    let FormComponent: ComponentType = $state(FormAgent);
    let sidbarTitle :string = $state("")

    function openDrawer(component: ComponentType,DrawerTitle :string): void {
        FormComponent = component;
        drawerHidden = false;
        sidbarTitle = DrawerTitle
    }

</script>
  
<Tabs tabStyle="underline" >
    <TabItem open title="Agents">
        <p>Agents</p>
        <div class="text-center  pt-8">
            <Button class="bg-th-red" on:click={() => (openDrawer(FormAgent,"Ajouter un agent"))}>Ajouter un agent</Button>
        </div>
    </TabItem>
    <TabItem title="Équipe">
        <p>equipe</p>
        <div class="text-center  pt-8">
            <Button class="bg-th-red" on:click={() => (openDrawer(FormTeam,"Ajouter une Équipe"))}>Ajouter une Équipe</Button>
        </div>
    </TabItem>
</Tabs>
<SidebarForm bind:hidden={drawerHidden} {sidbarTitle} {form} {FormComponent} />