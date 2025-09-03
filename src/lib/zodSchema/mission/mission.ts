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

export const schemaDeleteMission = z.object({
    deleteId:z.string()
});