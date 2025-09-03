import { z } from "zod";

const enumRoles = ['admin', 'manager', 'team_manager', 'agent'] as const;
const enumStatus = ["0","1"] as const;

export const schemaAddUser = z.object({
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
        .email("Email invalide")
        .regex(/^[a-zA-Z0-9._-]+@sgs\.(com|fr)$/,"L'email doit être une adresse sgs"),
    phone: z.string().min(1, 'Champ obligatoire'),
    role: z.enum(enumRoles),
    team: z.string().min(1, 'Champ obligatoire'),
});

export const schemaUpdateUser = z.object({
    userId:z.string(),
    firstName: z.string()
        .min(1, 'Champ obligatoire')
        .min(2,("Le nom doit contenir au moins 2 caractères"))
        .max(100,("Le nom ne peut pas dépasser 100 caractères")),
    lastName: z.string()
        .min(1, 'Champ obligatoire')
        .min(2,("Le nom doit contenir au moins 2 caractères"))
        .max(100,("Le nom ne peut pas dépasser 100 caractères")),
    phone: z.string().min(1, 'Champ obligatoire'),
    status: z.enum(enumStatus),
    role: z.enum(enumRoles),
    team: z.string().min(1, 'Champ obligatoire'),
});

export const schemaResetPass = z.object({
    userId:z.string()
});

export const schemaDeleteUser = z.object({
    deleteId:z.string()
});