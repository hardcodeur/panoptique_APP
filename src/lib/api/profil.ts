import {apiClient} from '../services/apiClient';
import type {ServerEvent} from "$lib/types"

export function getProfil(event?: ServerEvent): Promise<any> {
    return apiClient.get(`/profil`, event);
}

export function getProfilCurrentWeekShifts(event?: ServerEvent): Promise<any> {
    return apiClient.get(`/profil/current-week-shifts`, event);
}

export function getProfilCurrentMonthShiftsMetric(event?: ServerEvent): Promise<any> {
    return apiClient.get(`/profil/metric-shift`, event);
}
