import { fail, redirect } from '@sveltejs/kit';
import { getAuthToken } from "$lib/api/auth";

export const actions = {
    default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const API_URL = import.meta.env.VITE_API_URL;

    if (!email || !password) {
      return fail(400, { error: 'Email et mot de passe requis' });
    }

    const apiResponse = await getAuthToken(email, password)

    if (!apiResponse.ok) {
      return fail(401, { error: 'Identifiants invalides' });
    }
    const { token } = await apiResponse.json();
    
    if(!token){
      return fail(400, { error: 'Erreur API' });
    }

    // secure = uniquement en HTTPS (obligatoire en prod passé a true)
    cookies.set('auth_token', token, { path: '/', httpOnly: true, secure: false, sameSite: 'lax', maxAge: 86400,});
    return { success: true };
  }

}