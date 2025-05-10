import { fail } from '@sveltejs/kit';
import { z } from "zod";
import { getMissions } from "$lib/api/mission";
import { getTeams } from "$lib/api/team.js"
import { getMissionWhiteShifts } from "$lib/api/missionShifts";
import { getLocationLocationNote } from "$lib/api/locationLocationNote.js";

const locationNoteSchema = z.object({
    title: z.string()
    .min(1, "Champ obligatoire")
    .max(100, "Ne doit pas dépasser 100 caractères"),
    content: z.string()
    .min(1, "Champ obligatoire")
});

const schemaLocation = z.object({
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



export const actions = {

    addLocation: async ({ request, cookies }) => {

        const formData = Object.fromEntries(await request.formData());

        const result = schemaLocation.safeParse(formData);

        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            return fail(400, { errors,formData});
        }

        console.log("send");
        return { success: true };
  }

}

export async function load({cookies}) {

    const token :string = cookies.get('auth_token') as string;

    const apiMissionResponse :Response = await getMissions(token);
    const missionList = await apiMissionResponse.json();

    const apiMissionShiftsResponse :Response = await getMissionWhiteShifts(token);
    const missionShifts = await apiMissionShiftsResponse.json();

    const apiLocationResponse :Response = await getLocationLocationNote(token);
    const location = await apiLocationResponse.json();

    const apiTeamsResponse :Response = await getTeams(token);
    const teamList = await apiTeamsResponse.json();
    
    return {missionList,missionShifts,location,teamList};
}