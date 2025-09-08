import {apiClient} from '../services/apiClient';
import type {ServerEvent} from "$lib/types"


// Multiple users

// GET
export function getUsers(event?: ServerEvent): Promise<any> {
    return apiClient.get('/users', event);
}

export function getUserCurrentWeekShifts(userId: string, event?: ServerEvent): Promise<any> {
    return apiClient.get(`/users/${userId}/current-week-shifts`, event);
}

export function getUserCurrentMonthShiftsMetric(userId: string, event?: ServerEvent): Promise<any> {
    return apiClient.get(`/users/${userId}/metric-shift`, event);
}

// Unique user

// GET

export function getUserById(userId: string, event?: ServerEvent): Promise<any> {
    return apiClient.get(`/users/${userId}`, event);
}

export function getProfil(userId: string, event?: ServerEvent): Promise<any> {
    return apiClient.get(`/user/profil/${userId}`, event);
}

// ADD
export function addUser(body: any,event?: ServerEvent): Promise<any> {
    return apiClient.post('/users',body,event);
}

// UPDATE

export function updateUserPartial(userId: string,body: any,event?: ServerEvent): Promise<any> {
    return apiClient.patch(`/users/${userId}`,body,event);
}

// DELETE

export function deleteUser(userId: string,event?: ServerEvent): Promise<any> {
    return apiClient.delete(`/users/${userId}`,event);
}