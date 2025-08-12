import { apiClient } from '../services/apiClient';
import type { Cookies } from '@sveltejs/kit';

type ServerEvent = { cookies: Cookies; fetch: typeof fetch };

export function getTeams(event?: ServerEvent): Promise<any> {
    return apiClient.get('/teams', event);
}