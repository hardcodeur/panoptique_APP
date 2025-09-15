import type { PageServerLoad } from "./$types";
import type { ApiReturn } from '$lib/types';
import { fail,error } from '@sveltejs/kit';

import { updateCheckerUser } from "$lib/api/updateChecker";
import { getChangedFields } from "$lib/services/utils";
import { updateUserPartial} from "$lib/api/user";
import { apiUpdatePass} from "$lib/api/auth";

import { getProfil } from "$lib/api/profil"

import { updateProfilSchema,updateUserPassSchema } from "$lib/zodSchema/profil/profil";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
    try {

        const profil = await getProfil({ cookies, fetch });

        return { profil };

    } catch (err: any) {
        console.error("Erreur dans le chargement du profil:", err);
        throw error(err.status || 500, err.body?.message || 'Erreur lors du chargement du profil');
    }
}

export const actions = {

        profilUpdate: async ({ request, cookies }) => {
            // Parse form data
            const formData = Object.fromEntries(await request.formData()) as Partial<FormData> ;
    
            // Zod check Form requirement 
            const result = updateProfilSchema.safeParse(formData);
    
            if (!result.success) {
                const errors = result.error.flatten().fieldErrors;          
                return fail(400, { errors,formData});
            }
    
            const id = result.data.profilId
    
            //get original mission data
            let original;
            try {
                original = await updateCheckerUser(id, { cookies, fetch });
            } catch (error: any) {
                console.log(error.data?.detail ||  error.data?.message);
                return {
                    apiReturn:{
                        status:"error",
                        message: error.data?.detail ||  error.data?.message || "Profil introuvable."
                    } as ApiReturn
                };
            }
    
            // Compare data if have change
            const updatedFields = getChangedFields(original, result.data);
            
            // fields not change return message
            if (Object.keys(updatedFields).length === 0) {
                return {
                    apiReturn:{
                        status:"info",
                        message: 'Aucune modification détectée.'
                    } as ApiReturn
                };
            }
    
            // update
            try {
                const rep = await updateUserPartial(id,updatedFields,{ cookies, fetch });
                return {
                    actionName: 'profilUpdate',
                    formData : rep,
                    apiReturn:{
                        status:"success",
                        message:`Profil mis à jour avec succès !`
                    } as ApiReturn
                }
            } catch (error: any) {
                console.log(error.data?.detail ||  error.data?.message);
                return fail(400, {
                    formData,
                    apiReturn:{
                        status:"error",
                        message: error.data?.detail ||  error.data?.message || "Une erreur est survenue à l'enregistrement du profile"
                    } as ApiReturn
                });
            }
            
        },
        passUpdate: async ({ request, cookies }) => {
            // Parse form data
            const formData = Object.fromEntries(await request.formData()) as Partial<FormData> ;
    
            // Zod check Form requirement 
            const result = updateUserPassSchema.safeParse(formData);
    
            if (!result.success) {
                const errors = result.error.flatten().fieldErrors;          
                return fail(400, { errors,formData});
            }
    
            const id = result.data.profilId
    
            // update
            try {
                await apiUpdatePass(id,result.data,{ cookies, fetch });
                return {
                    actionName: 'profilUpdate',
                    apiReturn:{
                        status:"success",
                        message:`Mot de passe mis à jour avec succès !`
                    } as ApiReturn
                }
            } catch (error: any) {
                console.log(error.data?.detail ||  error.data?.message);
                return fail(400, {
                    formData,
                    apiReturn:{
                        status:"error",
                        message: error.data?.detail ||  error.data?.message || "Une erreur est survenue à la modification du mot de passe"
                    } as ApiReturn
                });
            }
            
        },
}



