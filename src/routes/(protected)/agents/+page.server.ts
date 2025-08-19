import { fail, error } from '@sveltejs/kit';
import { z } from "zod";
import type { ApiReturn } from '$lib/types';

// Call API
import { getUsers,addUser } from "$lib/api/user"
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
    phone: z.string()
    .min(1, 'Champ obligatoire')
    .regex(/^(?:(?:\+|00)33|0)[1-9]\d{8}$/,"L'email doit être une adresse sgs"),
    role: z.enum(roles),
    team: z.string().min(1, 'Champ obligatoire'),
});

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

        try {
            const rep = await addUser(formData,{ cookies, fetch });
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
    } catch (err) {
        throw error(500, 'Erreur lors du chargement des données');
    }
}
