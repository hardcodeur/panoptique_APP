import { fail,error } from '@sveltejs/kit';
import type { ApiReturn } from '$lib/types';
// zod
import { missionAddSchema,missionUpdateSchema,schemaDeleteMission } from "$lib/zodSchema/mission/mission";
import { schemaUpdateLocation,schemaAddLocation } from "$lib/zodSchema/mission/location";
// Api call
import { getMissions,getProfilMissions,getTeamMissions,addMission,updateMissionPartial,deleteMission} from "$lib/api/mission";
import { getLocationWhiteNote,updateLocationWhiteNotePatial,addLocationWhiteNote,getLocationTeamWithNote } from "$lib/api/location.js";
import { getTeamListName,getTeamsWithUsers } from "$lib/api/team"
import { getCustomerListName, } from "$lib/api/customer"
import { updateCheckerMission,updateCheckerLocation } from "$lib/api/updateChecker";

import { getChangedFields } from "$lib/services/utils";


export async function load({ cookies, fetch, parent }) {

    const { user } = await parent();

    try {
        const [
            missionList,
            location,
            teamList,
            temMemberList,
            customerList,
        ] = await Promise.all([
            (user?.role == "agent") ? getProfilMissions({ cookies, fetch }) : (user?.role == "team_manager") ? getTeamMissions({ cookies, fetch }) :getMissions({ cookies, fetch }),
            (user?.role == "agent" || user?.role == "team_manager") ? getLocationTeamWithNote({ cookies, fetch }) : getLocationWhiteNote({ cookies, fetch }),
            getTeamListName({ cookies, fetch }),
            getTeamsWithUsers({ cookies, fetch }),
            getCustomerListName({ cookies, fetch })
        ]);

        return {missionList,location,teamList,temMemberList,customerList,user};

    } catch (err) {
        throw error(500, 'Erreur lors du chargement des données');
    }
}



export const actions = {

    missionAdd : async ({ request, cookies }) => {
        // Parse form data
        const formData = Object.fromEntries(await request.formData());
        
        // Change shifts type string to object
        if (formData.shifts && typeof formData.shifts === 'string') {
            try {
                formData.shifts = JSON.parse(formData.shifts);
            } catch (e) {
                console.error("Erreur lors de l'analyse des champ 'Quarts' depuis JSON:", e);
                return fail(400, {
                    formData,
                    errors: { shifts: ['Les données des quarts sont mal formatées.'] },
                });
            }
        }
        
        // Zod check Form requirement 
        const result = missionAddSchema.safeParse(formData);

        if (!result.success) {
            const errors = result.error.format();         
            return fail(400, { errors,formData});
        }

        //add
        try {
            const rep = await addMission(result.data,{ cookies, fetch });
            return {
                actionName: 'missionAdd',
                apiReturn:{
                    status:"success",
                    message:`Mission ${rep.id} ajouté avec succès!`
                } as ApiReturn
            }
        } catch (error: any) {
            console.log(error.data?.detail ||  error.data?.message);
            return fail(400, {
                formData,
                apiReturn:{
                    status:"error",
                    message: error.data?.detail ||  error.data?.message || "Une erreur est survenue à l'enregistrement de l'utilisateur"
                } as ApiReturn
            });
        }
    },
    missionUpdate: async ({ request, cookies }) => {
        // Parse form data
        const formData = Object.fromEntries(await request.formData());

        //Change shifts type string to object
        if (formData.shifts && typeof formData.shifts === 'string') {
            try {
                formData.shifts = JSON.parse(formData.shifts);
            } catch (e) {
                console.error("Erreur lors de l'analyse des champ 'Quarts' depuis JSON:", e);
                return fail(400, {
                    formData,
                    errors: { shifts: ['Les données des quarts sont mal formatées.'] },
                });
            }
        }

        // Zod check Form requirement 
        const result = missionUpdateSchema.safeParse(formData);

        if (!result.success) {
            console.log(result.error.issues);
            const errors = result.error.flatten().fieldErrors;          
            return fail(400, { errors,formData});
        }

        const id = result.data.missionId

        //get original mission data
        let original;
        try {
            original = await updateCheckerMission(id, { cookies, fetch });
        } catch (error: any) {
            console.log(error.data?.detail ||  error.data?.message);
            return {
                apiReturn:{
                    status:"error",
                    message: error.data?.detail ||  error.data?.message || "Mission introuvable."
                } as ApiReturn
            };
        }

        // Compare data if have change
        const updatedFields = getChangedFields(original, result.data);
        
        // fields not change return message
        if (Object.keys(updatedFields).length === 0) {
            return {
                apiReturn:{
                    status:"info",
                    message: 'Aucune modification détectée.'
                } as ApiReturn
            };
        }
        
        // update
        try {
            const rep = await updateMissionPartial(id,updatedFields,{ cookies, fetch });            
            return {
                actionName: 'missionUpdate',
                // formData : rep, ## Not works
                apiReturn:{
                    status:"success",
                    message:`Mission ${rep.id} mis à jour avec succès !`
                } as ApiReturn
            }
        } catch (error: any) {
            console.log(error.data?.detail ||  error.data?.message);
            return fail(400, {
                formData,
                apiReturn:{
                    status:"error",
                    message: error.data?.detail ||  error.data?.message || "Une erreur est survenue à l'enregistrement de l'utilisateur."
                } as ApiReturn
            });
        }
        
    },
    missionDelete: async ({ request, cookies }) => {
        const formData = Object.fromEntries(await request.formData()) as Partial<FormData> ;
        // Zod check Form requirement 
        const result = schemaDeleteMission.safeParse(formData);
        
        if (!result.success) {
            console.log(result.error.issues);
            const errors = result.error.flatten().fieldErrors;          
            return fail(400, { errors,formData});
        }

        const id = result.data.deleteId

        try {
            await deleteMission(id,{ cookies, fetch });
            return {
                actionName: 'missionDelete',
                apiReturn:{
                    status:"success",
                    message:"Mission supprimé avec succès !"
                } as ApiReturn
            }
        } catch (error: any) {
            console.log(error.data?.detail ||  error.data?.message);
            return fail(400,{
                actionName: 'missionDelete',
                apiReturn:{
                    status:"error",
                    message:"Une erreur inattendue est survenue lors de la suppression de la mission !"
                } as ApiReturn
            })
        }
    },
    locationAdd: async ({ request, cookies }) => {

        const formData = Object.fromEntries(await request.formData());
        // Change location note type string to object
        if (formData.locationNote && typeof formData.locationNote === 'string') {
            try {
                formData.locationNote = JSON.parse(formData.locationNote);
            } catch (e) {
                console.error("Erreur lors de l'analyse du champ 'notes' depuis JSON:", e);
                return fail(400, {
                    formData,
                    errors: { locationNote: ['Les données des notes sont mal formatées.'] },
                });
            }
        }

        const result = schemaAddLocation.safeParse(formData);

        if (!result.success) {
            const errors = result.error.format();
            return fail(400, { errors,formData});
        }

        //add
        try {
            const rep = await addLocationWhiteNote(result.data,{ cookies, fetch });
            return {
                actionName: 'locationAdd',
                apiReturn:{
                    status:"success",
                    message:`Lieu ${rep.name} ajouté avec succès!`
                } as ApiReturn
            }
        } catch (error: any) {
            console.log(error.data?.detail ||  error.data?.message);
            return fail(400, {
                formData,
                apiReturn:{
                    status:"error",
                    message: error.data?.detail ||  error.data?.message || "Une erreur est survenue à l'enregistrement du lieu"
                } as ApiReturn
            });
        }
    },
    locationUpdate: async ({ request, cookies }) => {

        const formData = Object.fromEntries(await request.formData());
        // Change location note type string to object
        if (formData.locationNote && typeof formData.locationNote === 'string') {
            try {
                formData.locationNote = JSON.parse(formData.locationNote);
            } catch (e) {
                console.error("Erreur lors de l'analyse du champ 'notes' depuis JSON:", e);
                return fail(400, {
                    formData,
                    errors: { locationNote: ['Les données des notes sont mal formatées.'] },
                });
            }
        }

        const result = schemaUpdateLocation.safeParse(formData);

        if (!result.success) {
            const errors = result.error.format();
            return fail(400, { errors,formData});
        }

        const id = result.data.id

        //get original Location data
        let original;
        try {
            original = await updateCheckerLocation(id, { cookies, fetch });
        } catch (error: any) {
            console.log(error.data?.detail ||  error.data?.message);
            return {
                apiReturn:{
                    status:"error",
                    message: error.data?.detail ||  error.data?.message || "Lieu introuvable."
                } as ApiReturn
            };
        }

        // Compare data if have change
        const updatedFields = getChangedFields(original, result.data);

        
        // fields not change return message
        if (Object.keys(updatedFields).length === 0) {
            return {
                apiReturn:{
                    status:"info",
                    message: 'Aucune modification détectée.'
                } as ApiReturn
            };
        }

        //Update
        try {
            const rep = await updateLocationWhiteNotePatial(id,updatedFields,{ cookies, fetch });
            return {
                actionName: 'locationUpdate',
                apiReturn:{
                    status:"success",
                    message:`Lieu ${rep.name} ajouté avec succès!`
                } as ApiReturn
            }
        } catch (error: any) {
            console.log(error.data?.detail ||  error.data?.message);
            return fail(400, {
                formData,
                apiReturn:{
                    status:"error",
                    message: error.data?.detail ||  error.data?.message || "Une erreur est survenue à l'enregistrement du lieu"
                } as ApiReturn
            });
        }
    }
}

