import { z } from "zod";

export const locationNoteSchema = z.object({
    title: z.string()
    .min(1, "Champ obligatoire")
    .max(100, "Ne doit pas dépasser 100 caractères"),
    content: z.string()
    .min(1, "Champ obligatoire")
});

export const schemaLocation = z.object({
    name: z.string()
        .min(1, 'Champ obligatoire')
        .min(2,("Doit contenir au moins 2 caractères"))
        .max(50,("Ne doit pas dépasser 50 caractères")),
    address: z.string()
        .min(1, 'Champ obligatoire')
        .min(2,("Doit contenir au moins 2 caractères"))
        .max(100,("Ne doit pas dépasser 100 caractères")),
    team: z.string({
        required_error: "Sélectionner une équipe",
        invalid_type_error: "Type invalide"
    }).min(1, "Sélectionner une équipe"),
    notes: z.array(locationNoteSchema).optional()
});