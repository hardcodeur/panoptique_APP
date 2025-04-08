import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const API_URL = import.meta.env.VITE_API_URL;

    if (!email || !password) {
      return fail(400, { error: 'Email et mot de passe requis' });
    }

    const apiResponse = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!apiResponse.ok) {
      return fail(400, { error: 'Identifiants invalides' });
    }

    // Si succès, stocke le token et redirige
    const { token } = await apiResponse.json();
    console.log(token);
    
    // cookies.set('auth_token', token, { path: '/' });
    // throw redirect(303, '/dashboard');
  }

}