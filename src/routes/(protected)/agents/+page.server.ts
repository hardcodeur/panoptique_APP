import { fail, error } from '@sveltejs/kit';
import type { ApiReturn } from '$lib/types';

// Zod schema
import { schemaAddUser,schemaUpdateUser,schemaResetPass,schemaDeleteUser } from "$lib/zodSchema/agent/agent";
import { schemaAddTeam,schemaUpdateTeam,schemaDeleteTeam } from "$lib/zodSchema/agent/team";
// call API
import { getUsers,addUser,updateUserPartial,getUserById,deleteUser } from "$lib/api/user"
import { getTeamListName,addTeam,getTeamById,deleteTeam,updateTeamPartial } from "$lib/api/team"
import { apiResetPassword } from "$lib/api/auth"
import { getTeamsWhiteUsers,getTeamUnassignedUsers} from "$lib/api/teamUsers";

function getChangedFields(originalData: any, newData: any): { [key: string]: any } {
    const changedFields: { [key: string]: any } = {};
    for ( let key in newData) {
        if (key !== 'id' && originalData.hasOwnProperty(key) && originalData[key] !== newData[key]) {
            changedFields[key] = newData[key];
        }
    }
    return changedFields;
}


export async function load({cookies, fetch}) {
    // Get all data
    try {
        const [
            userList,
            teamList,
            teamWhiteUsers,
        ] = await Promise.all([
            getUsers({ cookies, fetch }),
            getTeamListName({ cookies, fetch }),
            getTeamsWhiteUsers({ cookies, fetch }),
        ]);
        return { userList, teamList, teamWhiteUsers};
    } catch (err: any) {
        console.log(err);
        throw error(500, 'Erreur lors du chargement des données');
    }
}

export const actions = { 

    userAdd: async ({request,cookies, fetch}) => {

        // Parse form data
        const formData = Object.fromEntries(await request.formData()) as Partial<FormData> ;
        // Zod check Form requirement 
        const result = schemaAddUser.safeParse(formData);

        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;            
            return fail(400, { errors,formData});
        }

        // add
        try {
            const rep = await addUser(result.data,{ cookies, fetch });
            return {
                actionName: 'userAdd',
                apiReturn:{
                    status:"success",
                    message:`Agent ${rep.firstName+" "+rep.lastName } ajouté avec succès!`
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
    userUpdate: async ({request,cookies, fetch}) => {

        // Parse form data
        const formData = Object.fromEntries(await request.formData()) as Partial<FormData> ;

        // Zod check Form requirement 
        const result = schemaUpdateUser.safeParse(formData);

        if (!result.success) {
            console.log(result.error.issues);
            const errors = result.error.flatten().fieldErrors;          
            return fail(400, { errors,formData});
        }

        const userId = result.data.userId

        //get original user data
        let originalUser;
        try {
            originalUser = await getUserById(userId, { cookies, fetch });
        } catch (error: any) {
            console.log(error.data?.detail ||  error.data?.message);
            return {
                apiReturn:{
                    status:"error",
                    message: error.data?.detail ||  error.data?.message || "Utilisateur introuvable."
                } as ApiReturn
            };
        }

        // Compare data if have change
        const updatedFields = getChangedFields(originalUser, result.data);
        
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
            const rep = await updateUserPartial(userId,updatedFields,{ cookies, fetch });
            return {
                formData : rep,
                actionName: 'userUpdate',
                apiReturn:{
                    status:"success",
                    message:`Agent ${rep.firstName+" "+rep.lastName } mis à jour avec succès !`
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
    userDelete : async ({request,cookies, fetch}) => {
        const formData = Object.fromEntries(await request.formData()) as Partial<FormData> ;
        // Zod check Form requirement 
        const result = schemaDeleteUser.safeParse(formData);
        
        if (!result.success) {
            console.log(result.error.issues);
            const errors = result.error.flatten().fieldErrors;          
            return fail(400, { errors,formData});
        }

        const userId = result.data.deleteId

        try {
            await deleteUser(userId,{ cookies, fetch });
            return {
                actionName: 'userDelete',
                apiReturn:{
                    status:"success",
                    message:"Utilisateur supprimé avec succès !"
                } as ApiReturn
            }
        } catch (error: any) {
            console.log(error.data?.detail ||  error.data?.message);
            return fail(400,{
                apiReturn:{
                    status:"error",
                    message:"Une erreur inattendue est survenue lors de la suppression de l'utilisateur !"
                } as ApiReturn
            })
        }

    },
    userResetPassword : async ({request,cookies, fetch}) => {
        const formData = Object.fromEntries(await request.formData()) as Partial<FormData> ;
        // Zod check Form requirement 
        const result = schemaResetPass.safeParse(formData);
        
        if (!result.success) {
            console.log(result.error.issues);
            const errors = result.error.flatten().fieldErrors;          
            return fail(400, { errors,formData});
        }

        const userId = result.data.userId

        try {
            await apiResetPassword({userId},{ cookies, fetch });
            return {
                actionName: 'resetPassword',
                apiReturn:{
                    status:"success",
                    message:"Mot de passe réinitialisé avec succès"
                } as ApiReturn
            }
        } catch (error: any) {
            console.log(error.data?.detail ||  error.data?.message);
            return fail(400,{
                apiReturn:{
                    status:"error",
                    message:"Une erreur inattendue est survenue lors de la réinitialisation du mot de passe."
                } as ApiReturn
            })
        }
    },
    addTeam : async({request,cookies, fetch})=>{

        const formData = Object.fromEntries(await request.formData()) as Partial<FormData> ;
        // Zod check Form requirement 
        const result = schemaAddTeam.safeParse(formData);

        if (!result.success) {
            console.log(result.error.issues);
            const errors = result.error.flatten().fieldErrors;          
            return fail(400, { errors,formData});
        }

        try {
            const rep = await addTeam(result.data,{ cookies, fetch });
            return {
                actionName: 'teamAdd',
                apiReturn:{
                    status:"success",
                    message:`Equipe ${rep.teamName} ajouté avec succès!`
                } as ApiReturn
            }
        } catch (error: any) {
            console.log(error.data?.detail ||  error.data?.message);
            return fail(400, {
                formData,
                apiReturn:{
                    status:"error",
                    message: error.data?.detail ||  error.data?.message || "Une erreur est survenue à l'enregistrement de l'équipe"
                } as ApiReturn
            });
        }
    },
    teamUpdate: async ({request,cookies, fetch}) => {

        // Parse form data
        const formData = Object.fromEntries(await request.formData()) as Partial<FormData> ;
        // Zod check Form requirement 
        const result = schemaUpdateTeam.safeParse(formData);

        if (!result.success) {
            console.log(result.error.issues);
            const errors = result.error.flatten().fieldErrors;          
            return fail(400, { errors,formData});
        }

        const teamId = result.data.teamId

        //get original user data
        let originalTeam;
        try {
            originalTeam = await getTeamById(teamId, { cookies, fetch });
        } catch (error: any) {
            console.log(error.data?.detail ||  error.data?.message);
            return {
                apiReturn:{
                    status:"error",
                    message: error.data?.detail ||  error.data?.message || "Utilisateur introuvable."
                } as ApiReturn
            };
        }

        // Compare data if have change
        const updatedFields = getChangedFields(originalTeam, result.data);
        
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
            const rep = await updateTeamPartial(teamId,updatedFields,{ cookies, fetch });
            return {
                formData : rep,
                actionName: 'teamUpdate',
                apiReturn:{
                    status:"success",
                    message:`L'équipe ${rep.teamName} mis à jour avec succès !`
                } as ApiReturn
            }
        } catch (error: any) {
            console.log(error.data?.detail ||  error.data?.message);
            return fail(400, {
                formData,
                apiReturn:{
                    status:"error",
                    message: error.data?.detail ||  error.data?.message || "Une erreur est survenue à l'enregistrement de l'équipe."
                } as ApiReturn
            });
        }
    },
    teamDelete : async ({request,cookies, fetch}) => {
        
        const formData = Object.fromEntries(await request.formData()) as Partial<FormData> ;
        //Zod check Form requirement 
        const result = schemaDeleteTeam.safeParse(formData);
        
        if (!result.success) {
            console.log(result.error.issues);
            const errors = result.error.flatten().fieldErrors;          
            return fail(400, { errors,formData});
        }

        const teamId = result.data.deleteId

        try {
            await deleteTeam(teamId,{ cookies, fetch });
            return {
                actionName: 'teamDelete',
                apiReturn:{
                    status:"success",
                    message:"L'équipe supprimé avec succès !"
                } as ApiReturn
            }
        } catch (error: any) {
            console.log(error.data?.detail ||  error.data?.message);
            return fail(400,{
                apiReturn:{
                    status:"error",
                    message:"Une erreur inattendue est survenue lors de la suppression de l'équipe !"
                } as ApiReturn
            })
        }

    },

}


