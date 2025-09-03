import {apiClient} from '../services/apiClient';
import type {ServerEvent} from "$lib/types"



export function getCustomerListName(event?: ServerEvent): Promise<any> {
    return apiClient.get('/customer/list/name', event);
}