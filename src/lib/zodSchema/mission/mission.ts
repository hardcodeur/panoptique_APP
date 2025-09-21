import { z } from 'zod';

export const shiftSchema = z.object({
    id: z.number().optional(),
    activity: z.enum(['connexion', 'surveillance', 'deconnexion']),
    start: z.string({ required_error: "Champ obligatoire" }).datetime("Format de date de début invalide."),
    end: z.string({ required_error: "Champ obligatoire" }).datetime("Format de date de fin invalide."),
    users: z.array(z.number()).nonempty("Champ obligatoire"),
}).refine(data => {
    if (data.start && data.start) {
        return new Date(data.end) > new Date(data.start);
    }
    return true;
}, {
    message: "L'heure de fin de quart doit être postérieure à l'heure de début.",
    path: ["end"],
});

export const missionAddSchema = z.object({
  start: z.string({ required_error: "Champ obligatoire" }).datetime("Format de date de début invalide."),
  end: z.string({ required_error: "Champ obligatoire" }).datetime("Format de date de fin invalide."),
  team: z.string({required_error: "Champ obligatoire"}),
  customer: z.string({required_error: "Champ obligatoire"}),
  shifts: z.array(shiftSchema).optional(),
}).refine((data) => new Date(data.end) > new Date(data.start), {
  message: "La date de fin doit être postérieure à la date de début.",
  path: ["end"], // Attach error to the 'end' field
});

export const missionUpdateSchema = z.object({
  missionId: z.string({ required_error: "L'ID de la mission est requis." }),
  start: z.string().datetime("Format de date de début invalide."),
  end: z.string().datetime("Format de date de fin invalide."),
  shifts: z.array(shiftSchema).optional(),
})
.refine((data) => {
  if (data.start && data.end) {
    return new Date(data.end) > new Date(data.start);
  }
  return true;
}, {
  message: "La date de fin doit être postérieure à la date de début.",
  path: ["end"],
});

export const schemaDeleteMission = z.object({
    deleteId:z.string()
});