import {apiClient} from '../services/apiClient';

export function apiAuthToken(email: string, password: string): Promise<any> {
    return apiClient.post('/login', { email, password });
}
