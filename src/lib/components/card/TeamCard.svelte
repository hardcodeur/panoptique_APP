<script lang="ts" >
    import { AccordionItem, Accordion,Button} from 'flowbite-svelte';
    import FormTeam from "$lib/components/form/Team/FormTeam.svelte";

    const {
        teamName,
        users,
        openDrawer
    } = $props();

    const countUsersStatus = (users) => {
        let available = 0, unavailable = 0;
        
        users.forEach(user => {
            user.status === "0" ? unavailable++ : available++;
        });

        return { available, unavailable };
    };

    const nbUsers = users.length
    const usersStatus = countUsersStatus(users);

    const btnEditClass="ts-text-bold text-th-blue hover:text-th-white hover:bg-th-blue"
    const pillAvailableClass="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm"
    const pillUnavailableClass="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm"
    const pillStatusText = (status: string): string =>{
        return (status !== "0") ? "Disponible" : "Congé";
    }
    const pillStatusClass = (status: string): string =>{
        return (status !== "0") ? pillAvailableClass : pillUnavailableClass;
    } 

</script>

<div class="max-w-sm h-fit p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
    <div class="flex justify-between items-center ">
        <span>{nbUsers} agents</span>
        <span>Equipe {teamName}</span>
        <Button outline size="xs" class={btnEditClass} on:click={() => (openDrawer(FormTeam,`Equipe - ${teamName}`))}>Modifier</Button>
    </div>
    <div class="flex justify-center mt-3">
        {#if usersStatus.available > 0}
        <span class={pillAvailableClass}>Disponible {usersStatus.available}/{nbUsers}</span>
        {/if}
        {#if usersStatus.unavailable > 0}
        <span class={pillUnavailableClass}>Congé{usersStatus.unavailable}/{nbUsers}</span>
        {/if}
    </div>
    <div>
        <Accordion flush>
            <AccordionItem>
                <span slot="header">Liste des membres</span>
                <div class="inline-grid grid-cols-3 gap-4">
                {#each users as user}
                    <span>{user.fullname}</span>
                    <span>{user.role}</span>
                    <span class={pillStatusClass(user.status)}>{pillStatusText(user.status)}</span>
                {/each}
                </div>
            </AccordionItem>
        </Accordion>
    </div>
</div>