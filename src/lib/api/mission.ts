import {apiClient} from '../services/apiClient';
import type {ServerEvent} from "$lib/types"

// Multiple
export function getMissions(event?: ServerEvent): Promise<any> {
    return apiClient.get('/missions', event);
}

export function getProfilMissions(event?: ServerEvent): Promise<any> {
    return apiClient.get('/profil/missions', event);
}

export function getTeamMissions(event?: ServerEvent): Promise<any> {
    return apiClient.get('/missions/team', event);
}

// Unique

export function getMissionsById(id: string,event?: ServerEvent): Promise<any> {
    return apiClient.get(`/mission/${id}`, event);
}

export function addMission(body: any,event?: ServerEvent): Promise<any> {
    return apiClient.post("/mission",body,event);
}

export function updateMissionPartial(id: string,body: any,event?: ServerEvent): Promise<any> {
    return apiClient.patch(`/mission/${id}`,body,event);
}

export function deleteMission(id: string,event?: ServerEvent): Promise<any> {
    return apiClient.delete(`/mission/${id}`,event);
}


export function getMissionWithShifts(event?: ServerEvent): Promise<any> {
    return apiClient.get('/missions/shifts', event);
}
