import { fail, error } from '@sveltejs/kit';
import { z } from "zod";

// Call API
import { getUsers } from "$lib/api/user"
import { getTeams } from "$lib/api/team"
import { getTeamsWhiteUsers,getTeamUnassignedUsers } from "$lib/api/teamUsers";


const roles = ['admin', 'manager', 'team_manager', 'agent'] as const;

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
        .email("Email invalide"),
    phone: z.string().min(1, 'Champ obligatoire'),
    role: z.enum(roles),
    team: z.string().min(1, 'Champ obligatoire'),
});

export const actions = {

    add: async ({request}) => {

        // Parse form data
        const formData = Object.fromEntries(await request.formData()) as Partial<FormData> ;
        // Zod check Form requirement 
        const result = schema.safeParse(formData);

        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;            
            return fail(400, { errors,formData});
        }

        console.log("send");
        return { success: true };
  }

}

export async function load({cookies, fetch}) {
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
