import { PUBLIC_API_URL } from '$env/static/public';

export async function getTeams(token: string): Promise<Response> {
    const response = await fetch(`${PUBLIC_API_URL}/teams`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    return response;
}