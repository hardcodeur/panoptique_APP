import { fail } from '@sveltejs/kit';
import { z } from "zod";
import { getMissions } from "$lib/api/mission";
import { getMissionWhiteShifts } from "$lib/api/missionShifts";

export async function load({cookies}) {

    const token :string = cookies.get('auth_token') as string;

    const apiMissionResponse :Response = await getMissions(token);
    const missionList = await apiMissionResponse.json();

    const apiMissionShiftsResponse :Response = await getMissionWhiteShifts(token);
    const missionShifts = await apiMissionShiftsResponse.json();
    
    return {missionList,missionShifts};
}