import { apiClient } from '../services/apiClient';
import type { Cookies } from '@sveltejs/kit';

type ServerEvent = { cookies: Cookies; fetch: typeof fetch };

export function getTeamsWhiteUsers(event?: ServerEvent): Promise<any> {
    return apiClient.get('/team/users', event);
}

export function getTeamUnassignedUsers(event?: ServerEvent): Promise<any> {
    return apiClient.get('/team/unassigned-users', event);
}