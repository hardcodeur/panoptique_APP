import {apiClient} from '../services/apiClient';
import type {ServerEvent} from "$lib/types"

export function getLocationWhiteNote(event?: ServerEvent): Promise<any> {
    return apiClient.get('/locations', event);
}

export function getLocationTeamWithNote(event?: ServerEvent): Promise<any> {
    return apiClient.get('/locations/team', event);
}

export function addLocationWhiteNote(body: any,event?: ServerEvent): Promise<any> {
    return apiClient.post('/location' ,body ,event);
}

export function updateLocationWhiteNotePatial(id: string,body: any,event?: ServerEvent): Promise<any> {
    return apiClient.patch(`/location/${id}`,body ,event);
}