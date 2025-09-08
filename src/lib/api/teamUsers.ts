import { apiClient } from '../services/apiClient';
import type { ServerEvent } from "$lib/types";

export function getTeamsWhiteUsers(event?: ServerEvent): Promise<any> {
    return apiClient.get('/team/users', event);
}

export function getTeamUnassignedUsers(event?: ServerEvent): Promise<any> {
    return apiClient.get('/team/unassigned-users', event);
}