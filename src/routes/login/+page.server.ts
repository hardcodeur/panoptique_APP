import { fail } from '@sveltejs/kit';

export const actions = {
    
  default: async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
      return fail(400, { error: "Email et mot de passe requis" });
    }

  }
};