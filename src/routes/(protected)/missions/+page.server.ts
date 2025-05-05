import { fail } from '@sveltejs/kit';
import { z } from "zod";
import { getMissions } from "$lib/api/mission.js";

export async function load({cookies}) {

    const token :string = cookies.get('auth_token') as string;
    const apiMissionResponse :Response = await getMissions(token);
    const missionList = await apiMissionResponse.json();
    
    return {missionList};
}