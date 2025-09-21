import {apiClient} from '../services/apiClient';
import type {ServerEvent} from "$lib/types"

// Multiple
export function getNotificationByUser(id: string,event?: ServerEvent): Promise<any> {
    return apiClient.get(`/notifications/user/${id}`, event);
}

// Unique

export function countNewNotification(event?: ServerEvent): Promise<any> {
    return apiClient.get("/notifications/count/new", event);
}

export function deleteNotification(id: string,event?: ServerEvent): Promise<any> {
    return apiClient.delete(`/notification/${id}`, event);
}