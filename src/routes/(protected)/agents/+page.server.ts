import { fail } from '@sveltejs/kit';
import { z } from "zod";
import { getUsers } from "$lib/api/user"


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
    
    const token :string = cookies.get('auth_token') as string;
    const apiResponse :Response = await getUsers(token);
    const userList = await apiResponse.json();    
    return { userList };
}
