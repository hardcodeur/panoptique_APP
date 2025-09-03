import { apiClient } from '../services/apiClient';
import type { Cookies } from '@sveltejs/kit';

type ServerEvent = { cookies: Cookies; fetch: typeof fetch };

export function getTeamListName(event?: ServerEvent): Promise<any> {
    return apiClient.get('/team/list/name', event);
}

// Unique

// Get
export function getTeamById(teamId: string,event?: ServerEvent) {
    return apiClient.get(`/team/${teamId}`,event)
}
// Add 
export function addTeam(body: any,event?: ServerEvent): Promise<any> {
    return apiClient.post('/team',body,event);
}

// Update 

export function updateTeamPartial(teamId: string,body: any,event?: ServerEvent) {
    return apiClient.patch(`/team/${teamId}`,body,event)
}

// Delete

export function deleteTeam(teamId: string,event?: ServerEvent) {
    return apiClient.delete(`/team/${teamId}`,event)
}