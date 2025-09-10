import { z } from "zod";

export const locationAddNoteSchema = z.object({
    title: z.string()
    .min(1, "Champ obligatoire")
    .max(100, "Ne doit pas dépasser 100 caractères"),
    note: z.string()
    .min(1, "Champ obligatoire")
});

export const schemaAddLocation = z.object({
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
    locationNote: z.array(locationAddNoteSchema)
    .optional(),
});


export const locationUpdateNoteSchema = z.object({
    id: z.string(),
    title: z.string()
    .min(1, "Champ obligatoire")
    .max(100, "Ne doit pas dépasser 100 caractères")
    .optional(),
    note: z.string()
    .min(1, "Champ obligatoire")
    .optional(),
});

export const schemaUpdateLocation = z.object({
    id: z.string(),
    name: z.string()
        .min(1, 'Champ obligatoire')
        .min(2,("Doit contenir au moins 2 caractères"))
        .max(50,("Ne doit pas dépasser 50 caractères"))
        .optional(),
    address: z.string()
        .min(1, 'Champ obligatoire')
        .min(2,("Doit contenir au moins 2 caractères"))
        .max(100,("Ne doit pas dépasser 100 caractères"))
        .optional(),
    team: z.string({
        required_error: "Sélectionner une équipe",
    }).min(1, "Sélectionner une équipe")
    .optional(),
    locationNote: z.array(locationUpdateNoteSchema)
    .optional()
});