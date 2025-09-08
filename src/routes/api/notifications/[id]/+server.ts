import { json } from '@sveltejs/kit';
import { PUBLIC_API_URL } from '$env/static/public';

export async function DELETE({ params, request, cookies }) {
    const accessToken = cookies.get('access_token');

    if (!accessToken) {
        return new Response('Unauthorized: JWT Token not found', { status: 401 });
    }

    const notificationId = params.id;

    try {
        const response = await fetch(`${PUBLIC_API_URL}/notification/${notificationId}`, {
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${accessToken}`}
        });

        if (!response.ok) {
            const errorData = await response.json();
            return json(errorData, { status: response.status });
        }

        return new Response(null, { status: 204 }); // No Content for successful deletion
    } catch (error) {
        console.error('Error proxying delete notification request:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}