import { json, error,redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_API_URL} from '$env/static/public';
import { ACCESS_TOKEN_LIFETIME} from '$env/static/private';

export const POST: RequestHandler = async ({ cookies }) => {
    const refreshToken = cookies.get('refresh_token');

    try {

        // No token
        if (!refreshToken) {
            throw error(401, 'No refresh token found');
        }

        // Backen API query
        const response = await fetch(`${PUBLIC_API_URL}/token/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw error(response.status, errorData.message || 'Failed to refresh token');
        }

        const {token} = await response.json();

        // Create new acces_token, the refresh token not change
        cookies.set('access_token', token, { 
            path: '/', 
            secure: true, 
            sameSite: 'lax', 
            maxAge: parseInt(ACCESS_TOKEN_LIFETIME, 10),
        });

        return json({
            code : 200,
            message : "Token refresh success"
        });

    } catch (err: any) {
        cookies.delete('access_token', { path: '/' });
        cookies.delete('refresh_token', { path: '/' });
        console.log(err);
        throw redirect(303, '/login');
    }
};