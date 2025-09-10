import {apiClient} from '$lib/services/apiClient';
import type {ServerEvent} from "$lib/types"

export function apiAuthToken(email: string, password: string,event?: ServerEvent): Promise<any> {
    return apiClient.post('/login', { email, password });
}

export function apiResetPassword(body: any,event?: ServerEvent): Promise<any> {
    return apiClient.post('/reset/password',body,event);
}

export function apiUpdatePass(userId: string,body: any,event?: ServerEvent): Promise<any> {
    return apiClient.post(`/change/password`,body,event);
}

