import { z } from 'zod';

export const missionAddSchema = z.object({
  start: z.string({ required_error: "La date de début est requise." }).datetime("Format de date de début invalide."),
  end: z.string({ required_error: "La date de fin est requise." }).datetime("Format de date de fin invalide."),
  team: z.string().min(1, "Veuillez sélectionner une équipe."),
  customer: z.string().min(1, "Veuillez sélectionner un client.")
}).refine((data) => new Date(data.end) > new Date(data.start), {
  message: "La date de fin doit être postérieure à la date de début.",
  path: ["end"], // Attach error to the 'end' field
});

export const missionUpdateSchema = z.object({
  missionId: z.string({ required_error: "L'ID de la mission est requis." }),
  start: z.string().datetime("Format de date de début invalide.").optional(),
  end: z.string().datetime("Format de date de fin invalide.").optional()
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