import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_API_URL} from '$env/static/public';
import { ACCESS_TOKEN_LIFETIME} from '$env/static/private';

export const POST: RequestHandler = async ({ cookies }) => {
    const refreshToken = cookies.get('refresh_token');

    // No token
    if (!refreshToken) {
        throw error(401, 'No refresh token found');
    }

    try {
        // Backen API query
        const response = await fetch(`${PUBLIC_API_URL}/token/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken })
        });


        // Fail - clean cookies
        if (!response.ok) {
            const errorData = await response.json();
            throw error(response.status, errorData.message || 'Failed to refresh token');
        }

        const {token} = await response.json();

        // Create new acces_token, the refresh token not change
        cookies.set('access_token', token, { 
            path: '/', 
            httpOnly: true, 
            secure: true, 
            sameSite: 'lax', 
            maxAge: parseInt(ACCESS_TOKEN_LIFETIME, 10),
        });

        return json({ success: true });

    } catch (err: any) {
        cookies.delete('access_token', { path: '/' });
        cookies.delete('refresh_token', { path: '/' });
        if (err.status) {
            throw err;
        }
        throw error(500, 'An unexpected error occurred during token refresh');
    }
};