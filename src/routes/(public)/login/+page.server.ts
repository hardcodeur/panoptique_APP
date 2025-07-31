import { fail } from '@sveltejs/kit';
import { z } from "zod";
import { apiAuthToken } from "$lib/api/auth";
import type { Actions } from './$types';
import { ACCESS_TOKEN_LIFETIME,REFRESH_TOKEN_LIFETIME} from '$env/static/private';

const schema = z.object({
    email: z.string()
        .min(1, 'Champ obligatoire')
        .max(100,("L'email ne peut pas dépasser 100 caractères"))
        .email("Email invalide")
        // .regex(/^[a-zA-Z0-9._-]+@sgs\.(com|fr)$/,"L'email doit être une adresse sgs")
        ,
    password: z.string()
        .min(1, 'Champ obligatoire')
        // .min(8,("Le mot de passe doit faire au moins 8 caractères"))
        // .max(32, "Le mot de passe ne doit pas dépasser 32 caractères")
        // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/,"Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial(!@#$%^&*)")
});

type FormData = z.infer<typeof schema>;


export const actions : Actions = {
    default: async ({ request, cookies }) => {

    // Parse form data
    const formData = Object.fromEntries(await request.formData()) as Partial<FormData> ;
    // Zod check Form requirement 
    const result = schema.safeParse(formData);

    const email : string = formData.email?.toString() || "";

    // Form error manager
    if (!result.success) {
        const error = result.error.flatten().fieldErrors;
        return fail(400, { error,email});
    }

    try {
      // Call api
      const {token,refresh_token} = await apiAuthToken(result.data.email, result.data.password);
            
      if(!token && !refresh_token){
        return fail(400, { error: { _global: ["Un problème technique a été détecté. Si l'erreur persiste après un nouvel essai, merci de signaler l'incident au service informatique."] }});
      }
      
      // Insert access and refresh token in secure cookies 
      cookies.set('access_token', token, { 
        path: '/', 
        httpOnly: true, 
        secure: true, 
        sameSite: 'lax', 
        maxAge: parseInt(ACCESS_TOKEN_LIFETIME, 10)
      });

      cookies.set('refresh_token', refresh_token, { 
        path: '/', 
        httpOnly: true, 
        secure: true, 
        sameSite: 'lax', 
        maxAge: parseInt(REFRESH_TOKEN_LIFETIME, 10)
      });
            
    } catch (error) {
      // call api error management
      if(error?.code === 401 && error?.message?.includes('Invalid credentials.')){
        return fail(400, { error: { _global: ["Identifiant invalide"] }});
      }

      return fail(500, { error: { _global: ["Erreur serveur"] }});
    }

  }

}