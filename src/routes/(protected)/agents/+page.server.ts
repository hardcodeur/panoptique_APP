import { fail } from '@sveltejs/kit';
import { z } from "zod";
import { getUsers } from "$lib/api/user"
import { getTeams } from "$lib/api/team.js"
import { error } from '@sveltejs/kit';
import { getTeamsWhiteUsers,getTeamUnassignedUsers } from "$lib/api/teamUsers.js";
import { authUserStore,Role } from "$lib/stores/authUserStore"


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

    add: async ({ request, cookies }) => {

        const formData = Object.fromEntries(await request.formData());
        const result = schema.safeParse(formData);

        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            return fail(400, { errors,formData});
        }

        console.log("send");
        return { success: true };
  }

}


export async function load({cookies}) {

    if(authUserStore.hasAnyRole(Role.ADMIN, Role.MANAGER, Role.TEAM_MANAGER)){
        throw error(403, {
            message: 'Accès interdit - Vous n\'avez pas les permissions nécessaires'
        });
    }

    const token :string = cookies.get('auth_token') as string;

    const apiUsersResponse :Response = await getUsers(token);
    const userList = await apiUsersResponse.json();

    const apiTeamsResponse :Response = await getTeams(token);
    const teamList = await apiTeamsResponse.json();

    const apiTeamsWhiteUsersResponse :Response = await getTeamsWhiteUsers(token);
    const teamWhiteUsers = await apiTeamsWhiteUsersResponse.json();

    const apiTeamUnassignedUsersResponse :Response = await getTeamUnassignedUsers(token);
    const teamUnassignedUsers = await apiTeamUnassignedUsersResponse.json();
    

    return { userList,teamList,teamWhiteUsers,teamUnassignedUsers};
}
