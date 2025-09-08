import { apiClient } from '../services/apiClient';
import type { ServerEvent } from "$lib/types";

export function updateCheckerUser(id: string,event?: ServerEvent): Promise<any> {
    return apiClient.get(`/update/checker/user/${id}`, event);
}

export function updateCheckerTeam(id: string,event?: ServerEvent): Promise<any> {
    return apiClient.get(`/update/checker/team/${id}`, event);
}

export function updateCheckerMission(id: string,event?: ServerEvent): Promise<any> {
    return apiClient.get(`/update/checker/mission/${id}`, event);
}