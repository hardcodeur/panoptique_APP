const API_URL :string = import.meta.env.VITE_API_URL;

export async function getNewAccessToken(refreshToken: string): Promise<Response> {
    return await fetch(`${API_URL}/api/token/refresh`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"refresh_token": refreshToken})
    });
}

export async function getAuthToken(email: string, password: string): Promise<Response> {
    return await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
}