<script lang="ts">
    import { AccordionItem, Accordion,Button} from 'flowbite-svelte';

    let {
        location
    }=$props()

</script>
<div class="full-w p-6 bg-white border border-gray-200 rounded-lg flex mt-4">
    <div class="flex flex-col basis-1/3">
        <div class="flex flex-col items-center justify-center">
            <span>{location.name}</span>
        </div>
    </div>
    <div class="basis-2/3">
        <div>
            <span>Adresse: {location.address}</span>
            {#if location.locationNote.length != 0}
            <Accordion>
                <AccordionItem>
                    <span slot="header">Afficher les notes</span>
                    <div class="">
                    {#each location.locationNote as note}
                        <div>
                            <span>{note.title}</span>
                            <p>{note.note}</p>
                        </div>
                    {/each}
                    </div>
                </AccordionItem>
            </Accordion>
            {/if}
        </div>
    </div>
</div>
<p>bouh</p>