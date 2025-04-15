<script lang="ts">
    import { Tabs, TabItem, Button } from 'flowbite-svelte';
    import SidebarForm from "$lib/components/sidebar/SidebarForm.svelte";
    import FormAddAgents from "$lib/components/form/agents/formAddAgents.svelte"

    let drawerHidden: boolean = true;
    let formComponent: ConstructorOfATypedSvelteComponent | null = null;
    let componentProps: Record<string, unknown> = {}

    function openDrawer(component: ConstructorOfATypedSvelteComponent, props = {}): void {
        formComponent = component;
        componentProps = props;
        drawerHidden = false;
    }

</script>
  
<Tabs tabStyle="underline" >
    <TabItem open title="Agents">
        <p>Agents</p>
        <div class="text-center  pt-8">
            <Button class="bg-th-red" on:click={() => (openDrawer(FormAddAgents))}>Create agents</Button>
        </div>
    </TabItem>
    <TabItem title="Équipe">
        <p>equipe</p>
        <div class="text-center  pt-8">
            <Button class="bg-th-red" on:click={() => (openDrawer(FormAddAgents))}>Create team</Button>
        </div>
    </TabItem>
</Tabs>
<SidebarForm bind:hidden={drawerHidden} {formComponent} {componentProps} />