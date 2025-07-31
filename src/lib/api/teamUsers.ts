import { PUBLIC_API_URL } from '$env/static/public';

export async function getTeamsWhiteUsers(token: string): Promise<Response> {
    const response = await fetch(`${PUBLIC_API_URL}/team/users`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    return response;
}

export async function getTeamUnassignedUsers(token: string): Promise<Response> {
    const response = await fetch(`${PUBLIC_API_URL}/team/unassigned-users`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    return response;
}