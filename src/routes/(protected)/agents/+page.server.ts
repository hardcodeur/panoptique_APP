import { fail, error } from '@sveltejs/kit';
import { z } from "zod";
import type { ApiReturn } from '$lib/types';

// Call API
import { getUsers,addUser,updateUserPartial,getUserById } from "$lib/api/user"
import { getTeams } from "$lib/api/team"
import { getTeamsWhiteUsers,getTeamUnassignedUsers } from "$lib/api/teamUsers";

const roles = ['admin', 'manager', 'team_manager', 'agent'] as const;

// field rules
const schema = z.object({
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
    role: z.enum(roles),
    team: z.string().min(1, 'Champ obligatoire'),
});

function getChangedFields(originalData: any, newData: any): { [key: string]: any } {
    const changedFields: { [key: string]: any } = {};
    for (const key in newData) {
        if (key !== 'id' && key !== 'userId' && originalData.hasOwnProperty(key) && originalData[key] !== newData[key]) {
            changedFields[key] = newData[key];
        }
    }
    return changedFields;
}

export const actions = {

    add: async ({request,cookies, fetch}) => {

        // Parse form data
        const formData = Object.fromEntries(await request.formData()) as Partial<FormData> ;
        // Zod check Form requirement 
        const result = schema.safeParse(formData);

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
                apiReturn:{
                    status:"success",
                    message:`Agent ${rep.firstName+" "+rep.lastName } ajouté avec succès!`
                } as ApiReturn
            }
        } catch (error: any) {
            return fail(400, {
                formData,
                apiReturn:{
                    status:"error",
                    message: error.data?.detail ||  error.data?.message || "Une erreur est survenue à l'enregistrement de l'utilisateur"
                } as ApiReturn
            });
        }
    },
    update: async ({request,cookies, fetch}) => {

        // Parse form data
        const formData = Object.fromEntries(await request.formData()) as Partial<FormData> ;
        console.log(formData);
        // Zod check Form requirement 
        const result = schema.safeParse(formData);

        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;          
            return fail(400, { errors,formData});
        }

        const userId = formData.userId

        //get original user data
        let originalUser;
        try {
            originalUser = await getUserById(userId, { cookies, fetch });
        } catch (error: any) {
            return {
                apiReturn:{
                    status:"error",
                    message: error.data?.detail ||  error.data?.message || "Utilisateur introuvable."
                } as ApiReturn
            };
        }

        // Compare data if have change
        const updatedFields = getChangedFields(originalUser, result.data);

        // fields not change 
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
                apiReturn:{
                    status:"success",
                    message:`Agent ${rep.firstName+" "+rep.lastName } mis à jour avec succès!`
                } as ApiReturn
            }
        } catch (error: any) {
            return fail(400, {
                formData,
                apiReturn:{
                    status:"error",
                    message: error.data?.detail ||  error.data?.message || "Une erreur est survenue à l'enregistrement de l'utilisateur."
                } as ApiReturn
            });
        }
    }

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
