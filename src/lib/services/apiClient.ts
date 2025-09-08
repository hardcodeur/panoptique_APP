import { PUBLIC_API_URL } from '$env/static/public';
import type { Cookies } from '@sveltejs/kit';

// Http client isomorphe

let refreshTokenPromise: Promise<void> | null = null;

async function refreshToken(fetcher: typeof fetch): Promise<void> {
    const response = await fetcher('/api/refresh', {
        method: 'POST'
    });

    if (!response.ok) {
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
        throw new Error('Failed to refresh token');
    }
}


type ServerEvent = { cookies: Cookies; fetch: typeof fetch };

export const apiClient = {
    async get(url: string, event: ServerEvent, options: RequestInit = {}) {
        return this.request('GET', url, null, event, options);
    },

    async post(url: string, body: any, event: ServerEvent, options: RequestInit = {}) {
        return this.request('POST', url, body, event, options);
    },

    async put(url: string, body: any, event: ServerEvent, options: RequestInit = {}) {
        return this.request('PUT', url, body, event, options);
    },

    async patch(url: string, body: any, event: ServerEvent, options: RequestInit = {}) {
        return this.request('PATCH', url, body, event, options);
    },

    async delete(url: string, event: ServerEvent, options: RequestInit = {}) {
        return this.request('DELETE', url, null, event, options);
    },

    async request(method: string, url: string, body: any, event: ServerEvent, options: RequestInit = {}): Promise<any> {
        
        const fetcher = event?.fetch;

        const requestMaker = async () => {

            const headers = new Headers(options.headers);

            // get cookie server 
            const accessToken = event.cookies.get('access_token');
            

            if (accessToken) {
                headers.append('Authorization', `Bearer ${accessToken}`);
            }

            if (body && !(body instanceof FormData)) {

                if(method !== "PATCH"){
                    headers.append('Content-Type', 'application/json');
                }

                if(method === "PATCH"){
                    headers.append('Content-Type', 'application/merge-patch+json');
                }
            }

            const config: RequestInit = {
                ...options,
                method,
                headers,
                credentials: 'include',
                body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : null,
            };

            const apiUrl = `${PUBLIC_API_URL}${url}`;
            return fetcher(apiUrl, config);
        };

        // Send request
        let response = await requestMaker();
        
        const data = await response.text().then(text => {
            try {
                return JSON.parse(text);
            } catch (e) {
                return null; 
            }
        });

        // [secure] if access token is expired send refresh
        if (response.status === 401 && data?.message?.includes('JWT Token not found')) {

            // Protection to prevent simultaneous refreshes request
            if (!refreshTokenPromise) {
                refreshTokenPromise = refreshToken(fetcher).finally(() => {
                    refreshTokenPromise = null;
                });
            }

            // Relaunching the request.
            try {
                await refreshTokenPromise;
                response = await requestMaker();
                const relaunchData = await response.text().then(text => text ? JSON.parse(text) : null);

                if (!response.ok) {
                    return Promise.reject(relaunchData);
                }
                
                return relaunchData;

            } catch (error) {
                return Promise.reject(error);
            }
        }

        if (!response.ok) {
            const error = new Error(data?.message || `API Error: ${response.status} ${response.statusText}`);
            (error as any).data = data;
            return Promise.reject(error);
        }

        return data;
    }
};