import { fail, error } from '@sveltejs/kit';
import { z } from "zod";
import type { ApiReturn } from '$lib/types';

// Call API
import { getUsers,addUser,updateUserPartial,getUserById,deleteUser } from "$lib/api/user"
import { getTeams } from "$lib/api/team"
import { apiResetPassword } from "$lib/api/auth"
import { getTeamsWhiteUsers,getTeamUnassignedUsers } from "$lib/api/teamUsers";

const enumRoles = ['admin', 'manager', 'team_manager', 'agent'] as const;
enum enumStatus {
    "dispo" = 1,
    "indispo" = 0
}

// field rules
const schemaAddUser = z.object({
    firstName: z.string()
        .min(1, 'Champ obligatoire')
        .min(2,("Le nom doit contenir au moins 2 caractères"))
        .max(100,("Le nom ne peut pas dépasser 100 caractères")),
    lastName: z.string()
        .min(1, 'Champ obligatoire')
        .min(2,("Le nom doit contenir au moins 2 caractères"))
        .max(100,("Le nom ne peut pas dépasser 100 caractères")),
    email: z.string()
        .min(1, 'Champ obligatoire')
        .email("Email invalide")
        .regex(/^[a-zA-Z0-9._-]+@sgs\.(com|fr)$/,"L'email doit être une adresse sgs"),
    phone: z.string().min(1, 'Champ obligatoire'),
    role: z.enum(enumRoles),
    team: z.string().min(1, 'Champ obligatoire'),
});

const schemaUpdateUser = z.object({
    userId:z.string(),
    firstName: z.string()
        .min(1, 'Champ obligatoire')
        .min(2,("Le nom doit contenir au moins 2 caractères"))
        .max(100,("Le nom ne peut pas dépasser 100 caractères")),
    lastName: z.string()
        .min(1, 'Champ obligatoire')
        .min(2,("Le nom doit contenir au moins 2 caractères"))
        .max(100,("Le nom ne peut pas dépasser 100 caractères")),
    phone: z.string().min(1, 'Champ obligatoire'),
    status: z.nativeEnum(enumStatus),
    role: z.enum(enumRoles),
    team: z.string().min(1, 'Champ obligatoire'),
});

const schemaDeleteAndResetPass = z.object({
    userId:z.string() // Ajouter un message
});

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
            teamUnassignedUsers
        ] = await Promise.all([
            getUsers({ cookies, fetch }),
            getTeams({ cookies, fetch }),
            getTeamsWhiteUsers({ cookies, fetch }),
            getTeamUnassignedUsers({ cookies, fetch })
        ]);
        return { userList, teamList, teamWhiteUsers, teamUnassignedUsers };
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

        // Serialization API
        result.data.team = `/api/teams/${result.data.team}`;

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

        if(formData.status){
            formData.status = parseInt(formData.status);
        }

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

        // Serialization for API
        if(updatedFields.team){
            updatedFields.team = `/api/teams/${result.data.team}`;
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
        const result = schemaDeleteAndResetPass.safeParse(formData);
        
        if (!result.success) {
            console.log(result.error.issues);
            const errors = result.error.flatten().fieldErrors;          
            return fail(400, { errors,formData});
        }

        const userId = result.data.userId

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
        const result = schemaDeleteAndResetPass.safeParse(formData);
        
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
    }

}


