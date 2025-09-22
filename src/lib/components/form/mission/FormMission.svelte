<script lang="ts">
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    import {Button,Label,Helper,Select,Input,MultiSelect} from "flowbite-svelte";
    import { CloseCircleSolid } from 'flowbite-svelte-icons';
    import type { ActionResult } from '@sveltejs/kit';
    import type {SelectInputValue} from "$lib/types"
    import type { ActionData } from './$types';

    type fieldShift = {
        id: number;
        activity: "connexion" | "surveillance" | "deconnexion" | null ;
        start: string;
        end: string;
        users: Array<string>;
    };

    let { 
        formReturn,
        formComponentData,
        itemUpdate = null
    } : { formReturn: ActionData | null; 
        formComponentData: any; 
        itemUpdate?: any 
    } = $props();

    let errors= $derived(formReturn?.errors);
    let submittedData= $derived(formReturn?.formData);
    let formAction: string= $derived(itemUpdate ? `?/missionUpdate`: '?/missionAdd');

    // state var
    let initialized: boolean = $state(false);
    let shiftsForm : boolean = $state(false);
    let shiftsFormBtnText: string = $derived((shiftsForm) ? "Masquer les quarts" : "Ajouter les quarts");
    // form var
    let missionStart: string = $state("");
    let missionEnd: string = $state("");
    let customerSelected: string = $state("");
    let teamSelected: string = $state("");
    // form var shift part
    let firstShift: fieldShift = $state({id:0,activity:"connexion",start:"",end:"",users:[]});
    let watchShift: Array<fieldShift> = $state([{id:1,activity:"surveillance",start:"",end:"",users:[]}])
    let lastShift: fieldShift = $state({id:99,activity:"deconnexion",start:"",end:"",users:[]})
    let shifts: Array<fieldShift> = $state([firstShift,...watchShift, lastShift]);

    let maxShiftDate = $derived(missionStart);
    let minShiftDate = $derived(missionEnd);

    $inspect(missionStart);
    
    let dynamicWatchShiftClass = (shiftId: number): string|void=>{
        if (shiftId != firstShift.id && shiftId != watchShift[0].id &&  shiftId != lastShift.id) {
            return "relative"
        }
    }

    let shiftsJSON: string = $derived(
        JSON.stringify(
            shifts.map(f => (
                {   
                    id : f.id,
                    activity: f.activity, 
                    start: (isDatetimeLocalFormat(f.start)) ? new Date(f.start).toISOString() :"", 
                    end: (isDatetimeLocalFormat(f.end)) ? new Date(f.end).toISOString() :"", 
                    users: f.users, 
                }
            ))
        )
    );
    let shiftUsersDisabled: boolean = $derived((teamSelected === "") ? true : false); 


    function convertDateISOToSting(isoString: string): string{
        const date = new Date(isoString)
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0')
        const hours = date.getHours().toString().padStart(2, '0'); 
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    function isDatetimeLocalFormat(date: string): boolean {
        // Date time format (2025-09-27T00:01)
        const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        return regex.test(date);
    }

    // reload component after submit form
    const handleEnhance = ({ formData })=>{

        // Mission START
        const start = formData.get('start');
        // return empty string for trigger validator
        const startFormat = (isDatetimeLocalFormat(start)) ? new Date(start).toISOString() :""
        formData.set('start', startFormat);

        // Mission END
        const end = formData.get('end');
        // return empty string for trigger validator
        const endFormat = (isDatetimeLocalFormat(end)) ? new Date(end).toISOString() : ""
        formData.set('end', endFormat);
        
        return async ({ result,update }: { result: ActionResult,update:()=>void })=>{
            if (result.type === 'success'){
                await invalidateAll();
            }
            update();
        }
    }

    // display form btn 

    let disabledBtnDisplayForm = $derived(missionStart === "" || missionEnd === "" || customerSelected === "" || teamSelected === "")

    const displayShiftsForm = ()=>{
        shiftsForm = (shiftsForm) ? false : true;
    }

    // Dynamic field
    let nextId = $state(Math.max(...watchShift.map(f => f.id)) + 1);


    const addShift = () => {
        watchShift = [...watchShift, {id:nextId++,activity:"surveillance",start:"",end:"",users:[]}];
    };

    const removeShift = (id: number) => {
        watchShift = watchShift.filter(field => field.id !== id);
    };

    // SELECT inputs
    const teamList = formComponentData.teamList;
    let teamItems :SelectInputValue[] = $state([]);
    teamList.forEach(team => {
        teamItems = [...teamItems, { value: team.id, name: team.teamName }];
    });

    const teamMemberList = formComponentData.temMemberList;
    let teamMemberItems :SelectInputValue[] = $derived(
        teamMemberList.find(team => team.id == teamSelected) ?.users.map(user => ({ value: user.id, name: user.fullname })) ?? []
    );

    const customerList = formComponentData.customerList;
    let customerItems :SelectInputValue[] = $state([]);
    customerList.forEach(customer => {
        customerItems = [...customerItems, { value: customer.id, name: customer.name }];
    });
    
    $effect(()=>{
        
        firstShift.start = missionStart;
        lastShift.end = missionEnd

        //field values
        if (itemUpdate && !initialized) { // init form with update data
            
            initialized = true; // Mark as initialized
            missionStart = convertDateISOToSting(itemUpdate.start);
            missionEnd = convertDateISOToSting(itemUpdate.end);
            customerSelected = itemUpdate.customerId;
            teamSelected = itemUpdate.teamId;

            if(itemUpdate.shifts.length > 0){
                const connexionShift = itemUpdate.shifts.find(shift => shift.activity === 'connexion');
                if (connexionShift ) {
                    firstShift = {
                        id: connexionShift.id, 
                        activity: connexionShift.activity,
                        start: convertDateISOToSting(connexionShift.start),
                        end: convertDateISOToSting(connexionShift.end),
                        users: connexionShift.users.map(user => user.id)
                    }
                }
    
                watchShift = itemUpdate.shifts?.filter(shift => shift.activity === 'surveillance').map((shift)=>(
                    {
                        id: shift.id, 
                        activity: shift.activity,
                        start: convertDateISOToSting(shift.start),
                        end: convertDateISOToSting(shift.end),
                        users: shift.users.map(user => user.id)
                    }
                ))
                
                const deconnexionShift = itemUpdate.shifts?.find(shift => shift.activity === 'deconnexion');                        
                if (deconnexionShift) {
                    lastShift = {
                        id: deconnexionShift.id, 
                        activity: deconnexionShift.activity,
                        start: convertDateISOToSting(deconnexionShift.start),
                        end: convertDateISOToSting(deconnexionShift.end),
                        users: deconnexionShift.users.map(user => user.id)
                    }
                };

                // Open shift panel
                shiftsForm=true;
            }


        } 
        else if (submittedData) { // handle form submission errors

            missionStart = convertDateISOToSting(submittedData.start);
            missionEnd = convertDateISOToSting(submittedData.end);
            customerSelected = submittedData.customer;
            teamSelected = submittedData.team;

            const connexionShift = submittedData.shifts.find(shift => shift.activity === 'connexion');
            if (connexionShift) {
                firstShift = {
                    id: connexionShift.id, 
                    activity: connexionShift.activity,
                    start: convertDateISOToSting(connexionShift.start),
                    end: convertDateISOToSting(connexionShift.end),
                    users: connexionShift.users.map(user => user.id)
                }
            };

            watchShift = submittedData.shifts.filter(shift => shift.activity === 'surveillance').map((shift)=>(
                {
                    id: shift.id, 
                    activity: shift.activity,
                    start: convertDateISOToSting(shift.start),
                    end: convertDateISOToSting(shift.end),
                    users: shift.users.map(user => user.id)
                }
            ))
            
            const deconnexionShift = submittedData.shifts.find(shift => shift.activity === 'deconnexion');                        
            if (deconnexionShift) {
                lastShift = {
                    id: deconnexionShift.id, 
                    activity: deconnexionShift.activity,
                    start: convertDateISOToSting(deconnexionShift.start),
                    end: convertDateISOToSting(deconnexionShift.end),
                    users: deconnexionShift.users.map(user => user.id)
                }
            };
        } 
        else if (!itemUpdate && initialized) { // reset form for new item creation
            missionStart = "";
            missionEnd = "";
            customerSelected = '';
            teamSelected = '';
            firstShift = {id:0,activity:"connexion",start:"",end:"",users:[]};
            watchShift = [{id:1,activity:"surveillance",start:"",end:"",users:[]}]
            lastShift = {id:99,activity:"deconnexion",start:"",end:"",users:[]}
            shifts = [firstShift,...watchShift, lastShift];
            initialized = false;
        }

        shifts = [firstShift,...watchShift, lastShift];
    });

    const inputDisabled = (itemUpdate) ? true  : false
    const btnClass="text-center focus-within:ring-4 focus-within:outline-hidden inline-flex items-center justify-center px-5 py-2.5 text-white bg-th-blue hover:bg-primary-800 rounded-lg"
    const helperClass="text-sm text-th-red mt-2";
    
</script>

<form use:enhance={handleEnhance} method="POST" action={formAction} class="mb-6">
    {#if itemUpdate}
    <input type="hidden" name="missionId" value="{itemUpdate.id}">
    {/if}
    <div class="mb-6">
        <Label for="start" class="ts-text-bold block mb-2">Arrivée du bateau</Label>
        <Input type="datetime-local" class="text-th-black border-th-black-light" id="start" bind:value={missionStart} name="start"/>
        {#if errors?.start?._errors}
        <Helper class={helperClass}> 
            {errors.start?._errors[0]}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label for="end" class="ts-text-bold block mb-2">Départ du bateau</Label>
        <Input type="datetime-local" class="text-th-black border-th-black-light" id="end" bind:value={missionEnd} name="end"/>
        {#if errors?.end?._errors}
        <Helper class={helperClass}> 
            {errors.end?._errors[0]}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label class="ts-text-bold mb-2">
            Équipe
            <Select disabled={inputDisabled} name="team" class="mt-2 ts-text text-th-black border-th-black-light capitalize" placeholder="Liste des équipes" items={teamItems} bind:value={teamSelected} />
        </Label>
        {#if errors?.team?._errors}
        <Helper class={helperClass}> 
            {errors.team?._errors[0]}
        </Helper>
        {/if}
    </div>
    <div class="mb-6">
        <Label class="ts-text-bold mb-2">
            Client
            <Select disabled={inputDisabled} name="customer" class="mt-2 ts-text text-th-black border-th-black-light capitalize" placeholder="Liste des clients" items={customerItems} bind:value={customerSelected} />
        </Label>
        {#if errors?.customer?._errors}
        <Helper class={helperClass}> 
            {errors.customer?._errors[0]}
        </Helper>
        {/if}
    </div>
    <div class="flex justify-end pb-4 space-x-4 md:px-4">
        <Button disabled={disabledBtnDisplayForm} type="button" onclick={()=>displayShiftsForm()} class="ts-text-bold border focus-within:ring-0 border-th-red text-th-red hover:text-th-white hover:bg-th-red">
                {shiftsFormBtnText}
        </Button>
    </div>
    {#if shiftsForm }
    <div class="mb-6">
        <p class="ts-text-bold mb-2">Quarts</p>
        <input type="hidden" name="shifts" value={shiftsJSON} />
        {#each shifts as shift, i (shift.id) }
        <div class="p-4 border border-th-black-light rounded-lg mb-4 {dynamicWatchShiftClass(shift.id)} ">
            <div class="mb-2 flex border-b border-th-black-light pb-2">
                <span class="ts-text-bold block">Quart de <span class="text-th-red">{shift.activity} {(shift.activity === "surveillance") ? i : ""}</span></span>
                {#if shift.id != firstShift.id && shift.id != watchShift[0].id &&  shift.id != lastShift.id }
                <button type="button" onclick={() => removeShift(shift.id)} class="absolute top-2 right-2 text-th-red hover:text-red-700 text-xl" title="Supprimer ce quart">
                    <CloseCircleSolid class="fill-th-red" size="lg"/>
                </button>
                {/if}
            </div>
            <div class="mb-6">
                <Label for="start-{shift.id}" class="ts-text-bold block mb-2">Début de quart</Label>
                <Input type="datetime-local" min={maxShiftDate} max={minShiftDate} class="text-th-black" id="start-{shift.id}" bind:value={shift.start}/>
                {#if errors?.shifts?.[i]?.start?._errors}
                    <Helper class={helperClass}>
                        {errors.shifts[i].start?._errors[0]}
                    </Helper>
                {/if}
            </div>
            <div class="mb-6">
                <Label for="end-{shift.id}" class="ts-text-bold block mb-2">Fin de quart</Label>
                <Input type="datetime-local" class="text-th-black" min={maxShiftDate} max={minShiftDate} id="end-{shift.id}"  bind:value={shift.end} />
                {#if errors?.shifts?.[i]?.end?._errors}
                    <Helper class={helperClass}>
                        {errors.shifts[i].end?._errors[0]}
                    </Helper>
                {/if}
            </div>
            <div class="mb-6">
                <Label for="users-{shift.id}" class="ts-text-bold mb-2">
                    Agents
                    <MultiSelect disabled={shiftUsersDisabled} id="users-{shift.id}"  class="mt-2 ts-text text-th-black border-th-black-light capitalize" placeholder="Liste de l'équipe" items={teamMemberItems} bind:value={shift.users}/>
                </Label>
                {#if errors?.shifts?.[i]?.users?._errors}
                    <Helper class={helperClass}>
                        {errors.shifts[i].users?._errors[0]}
                    </Helper>
                {/if}
            </div>
        </div>
        {#if shift.id === watchShift[watchShift.length - 1].id}            
        <div class="flex justify-end pb-4 space-x-4 md:px-4">
            <Button type="button" onclick={()=>addShift()} class="ts-text-bold border focus-within:ring-0 border-th-red text-th-red hover:text-th-white hover:bg-th-red">
                Ajouter un quart
            </Button>
        </div>
        {/if}
        {/each}
    </div>
    {/if}

    <div class="flex justify-end pb-4 space-x-4 md:px-4">
      <Button type="submit" class={btnClass}>Enregistrer</Button>
    </div>
</form>