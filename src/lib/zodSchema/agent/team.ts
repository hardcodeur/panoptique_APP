import { z } from "zod";

export const schemaAddTeam = z.object({
    teamName:z.string()
    .min(1, 'Champ obligatoire')
    .min(2,("Le nom doit contenir au moins 2 caractères"))
    .max(50,("Le nom ne peut pas dépasser 50 caractères")),
});

export const schemaUpdateTeam = z.object({
    teamId:z.string(),
    teamName:z.string()
    .min(1, 'Champ obligatoire')
    .min(2,("Le nom doit contenir au moins 2 caractères"))
    .max(50,("Le nom ne peut pas dépasser 50 caractères")),
});

export const schemaDeleteTeam = z.object({
    deleteId:z.string()
});