import { PUBLIC_API_URL } from '$env/static/public';

export async function getLocationLocationNote(token: string): Promise<Response> {
    const response = await fetch(`${PUBLIC_API_URL}/mission/locations`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    return response;
}