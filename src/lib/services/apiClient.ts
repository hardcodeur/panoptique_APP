import { PUBLIC_API_URL } from '$env/static/public';

// A promise for the refresh token operation.
// This allows subsequent failed requests to wait for the same refresh operation to complete.
let refreshTokenPromise: Promise<void> | null = null;

/**
 * Appelle notre propre backend SvelteKit pour rafraîchir le token.
 * Le backend s'occupe de lire le cookie httpOnly et de mettre à jour les tokens.
 * Cette fonction est appelée UNIQUEMENT par le apiClient.
 */
async function refreshToken(): Promise<void> {
    // On utilise un fetch natif ici pour éviter une boucle infinie si l'appel à /api/refresh échoue lui-même.
    const response = await fetch('/api/refresh', {
        method: 'POST'
    });

    if (!response.ok) {
        // Si le refresh échoue, le serveur a probablement déjà supprimé les cookies.
        // On redirige côté client pour finaliser la déconnexion.
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
        throw new Error('Failed to refresh token');
    }
}


export const apiClient = {
    async get(url: string, options: RequestInit = {}) {
        return this.request('GET', url, null, options);
    },

    async post(url: string, body: any, options: RequestInit = {}) {
        return this.request('POST', url, body, options);
    },

    async put(url: string, body: any, options: RequestInit = {}) {
        return this.request('PUT', url, body, options);
    },

    async delete(url: string, options: RequestInit = {}) {
        return this.request('DELETE', url, null, options);
    },

    async request(method: string, url: string, body: any, options: RequestInit = {}): Promise<any> {

        const performRequest = async () => {
            const headers = new Headers(options.headers);

            if (body && !(body instanceof FormData)) {
                headers.append('Content-Type', 'application/json');
            }

            const config: RequestInit = {
                ...options,
                method,
                headers,
                credentials: 'include', // TRÈS IMPORTANT: envoie les cookies avec la requête
                body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : null,
            };

            const finalUrl = `${PUBLIC_API_URL}${url}`;
            return fetch(finalUrl, config);
        };

        let response = await performRequest();
        
        // Try to parse JSON, but handle empty responses gracefully.
        const data = await response.text().then(text => {
            try {
                return JSON.parse(text);
            } catch (e) {
                return null; // Return null if body is not valid JSON
            }
        });

        if (response.status === 401 && data?.message?.includes('Expired JWT Token')) {
            // If there's no ongoing refresh, start one.
            if (!refreshTokenPromise) {
                refreshTokenPromise = refreshToken().finally(() => {
                    // Once the refresh attempt is complete (success or failure),
                    // reset the promise so the next 401 will trigger a new refresh.
                    refreshTokenPromise = null;
                });
            }

            try {
                // Wait for the single, shared refresh operation to complete.
                await refreshTokenPromise;
                
                // After a successful refresh, retry the original request.
                response = await performRequest();
                
                // Parse the response of the retried request.
                const retryData = await response.text().then(text => text ? JSON.parse(text) : null);

                if (!response.ok) {
                    // If the retry itself fails, reject with its error info.
                    return Promise.reject(retryData);
                }
                
                return retryData;

            } catch (error) {
                // This catches errors from refreshToken() or the network layer of performRequest().
                // The refreshToken() function handles redirection, so we just reject
                // to stop the current chain of operations.
                return Promise.reject(error);
            }
        }

        if (!response.ok) {
            return Promise.reject(data);
        }

        return data;
    }
};
