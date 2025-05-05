import { getUsers } from "$lib/api/user"
import { getTeams } from "$lib/api/team.js"

export async function load({cookies}) {

    const token :string = cookies.get('auth_token') as string;

    const apiUsersResponse :Response = await getUsers(token);
    const userList = await apiUsersResponse.json();



    return { userList};
}