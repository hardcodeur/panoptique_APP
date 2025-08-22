<script lang="ts">
    import { enhance } from '$app/forms';
    import {Button,AccordionItem, Accordion} from "flowbite-svelte";

    let {
        userId
    }: {
        userId : string
    } =$props()
</script>



<Accordion flush >
    <AccordionItem>
    {#snippet header()}Options du compte{/snippet}
    <p>Gérez les paramètres importants liés à ce compte utilisateur.</p>
        <Accordion flush> 
            <AccordionItem>
                {#snippet header()}Réinitialiser le mot de passe{/snippet}
                <p>Générez un nouveau mot passe pour l'utilisateur.<br>Cela mettra fin à ses sessions actuelles</p>
                <div class="flex justify-end pb-4 space-x-4 md:px-4">
                    <form use:enhance method="POST" action="?/userResetPassword" class="mt-6">
                        <input type="hidden" name="userId" value={userId}>
                        <Button type="submit" class="xt-center focus-within:ring-4 focus-within:outline-hidden inline-flex items-center justify-center px-5 py-2.5 text-white bg-th-red hover:bg-primary-800 rounded-lg">Réinitialiser le mot de passe</Button>
                    </form>
                </div>
            </AccordionItem>
        </Accordion>
        <Accordion flush>
            <AccordionItem>
                {#snippet header()}Supprimer le profil{/snippet}
                <p>Supprime définitivement ce profil utilisateur et toutes ses données associées.<br>Cette action est irréversible !</p>
                <div class="flex justify-end pb-4 space-x-4 md:px-4">
                    <form use:enhance method="POST" action="?/userDelete" class="mt-6">
                        <input type="hidden" name="userId" value={userId}>
                        <Button type="submit" class="xt-center focus-within:ring-4 focus-within:outline-hidden inline-flex items-center justify-center px-5 py-2.5 text-white bg-th-red hover:bg-primary-800 rounded-lg">Supprimer le profil</Button>
                    </form>
                </div>
            </AccordionItem>
        </Accordion>
    </AccordionItem>
</Accordion>