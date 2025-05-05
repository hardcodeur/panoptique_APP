import { getUsersById } from "$lib/api/user"
import { authUserStore } from "$lib/stores/authUserStore.js"

export async function load({cookies}) {

    const token :string = cookies.get('auth_token') as string;
    const userId = authUserStore.getUserId();
    
    const apiUserResponse :Response = await getUsersById(token,userId);
    const profil = await apiUserResponse.json();

    return {profil};
}


