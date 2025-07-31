import apiClient from '../services/apiClient';

export function getUsers(): Promise<any> {
    return apiClient.get('/users');
}

export function getUsersById(userId: string): Promise<any> {
    return apiClient.get(`/users/${userId}`);
}

export function getUserCurrentWeekShifts(userId: string): Promise<any> {
    return apiClient.get(`/users/${userId}/current-week-shifts`);
}

export function getUserCurrentMonthShiftsMetric(userId: string): Promise<any> {
    return apiClient.get(`/users/${userId}/metric-shift`);
}