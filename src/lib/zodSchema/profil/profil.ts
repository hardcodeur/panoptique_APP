import { z } from 'zod';

export const updateProfilSchema = z.object({
	profilId: z.string({ required_error: "L'ID de l'utilisateur est requis" }),
	phone: z
		.string()
		.min(10, { message: 'Le numéro de téléphone doit contenir au moins 10 chiffres' })
		.optional()
});

export const updateUserPassSchema = z.object({
	profilId: z.string({ required_error: "L'ID de l'utilisateur est requis" }),
    newPass: z
        .string()
        .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' }),
    confirmNewPass: z
        .string()
        .min(8, { message: 'La confirmation du mot de passe doit contenir au moins 8 caractères' })
})
.refine(
    (data) => {
        return data.newPass === data.confirmNewPass;
    },
    {
        message: 'Les mots de passe ne correspondent pas',
        path: ['passwordConfirm'] // Set the error on the confirmation field
    }
);
