import { fail } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import type { ApiReturn } from '$lib/types';
// zod
import { missionAddSchema,schemaDeleteMission } from "$lib/zodSchema/mission/mission";
import { locationNoteSchema,schemaLocation } from "$lib/zodSchema/mission/location";
// Api call
import { getMissionLocationWhiteNote,getMissionWhiteShifts,getMissions,addMission,updateMission,deleteMission} from "$lib/api/mission";
import { getTeamListName, } from "$lib/api/team"
import { getCustomerListName, } from "$lib/api/customer"



export async function load({ cookies, fetch }) {
    try {
        const [
            missionList,
            missionShifts,
            location,
            teamList,
            customerList,
        ] = await Promise.all([
            getMissions({ cookies, fetch }),
            getMissionWhiteShifts({ cookies, fetch }),
            getMissionLocationWhiteNote({ cookies, fetch }),
            getTeamListName({ cookies, fetch }),
            getCustomerListName({ cookies, fetch })
        ]);

        return {missionList,missionShifts,location,teamList,customerList};

    } catch (err) {
        console.log(err);
        throw error(500, 'Erreur lors du chargement des données');
    }
}



export const actions = {

    missionAdd : async ({ request, cookies }) => {
        // Parse form data
        const formData = Object.fromEntries(await request.formData());
        // Zod check Form requirement 
        const result = missionAddSchema.safeParse(formData);

        if (!result.success) {
            
            const errors = result.error.flatten().fieldErrors;            
            return fail(400, { errors,formData});
        }

        // add
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
                apiReturn:{
                    status:"error",
                    message:"Une erreur inattendue est survenue lors de la suppression de la mission !"
                } as ApiReturn
            })
        }
    },
    addLocation: async ({ request, cookies }) => {

        const formData = Object.fromEntries(await request.formData());

        const result = schemaLocation.safeParse(formData);

        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            return fail(400, { errors,formData});
        }

        console.log("send");
        return { success: true };
  }

}

