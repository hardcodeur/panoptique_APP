import {apiClient} from '../services/apiClient';
import type { Cookies } from '@sveltejs/kit';

// Définition du type pour l'événement serveur partiel que nos fonctions accepteront
// On le rend optionnel avec `?` pour qu'il puisse être omis côté client.
type ServerEvent = { cookies: Cookies; fetch: typeof fetch };

// Multiple users

// GET
export function getUsers(event?: ServerEvent): Promise<any> {
    return apiClient.get('/users', event);
}

export function getUsersById(userId: string, event?: ServerEvent): Promise<any> {
    return apiClient.get(`/users/${userId}`, event);
}

export function getUserCurrentWeekShifts(userId: string, event?: ServerEvent): Promise<any> {
    return apiClient.get(`/users/${userId}/current-week-shifts`, event);
}

export function getUserCurrentMonthShiftsMetric(userId: string, event?: ServerEvent): Promise<any> {
    return apiClient.get(`/users/${userId}/metric-shift`, event);
}

// Unique user

// ADD
export function addUser(body: any,event?: ServerEvent): Promise<any> {
    return apiClient.post('/users',body,event);
}