import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './+server';
import { json, error } from '@sveltejs/kit';
import { PUBLIC_API_URL } from '$env/static/public';

// Mock SvelteKit modules
vi.mock('@sveltejs/kit', () => ({
    json: vi.fn((data) => data as any),
    error: vi.fn((status, message) => ({
        status,
        message
    })),
}));

// Mock environment variables
vi.mock('$env/static/private', () => ({
    ACCESS_TOKEN_LIFETIME: '900', // 15 minutes in seconds
}));

// Mock global fetch
global.fetch = vi.fn();

describe('POST /api/refresh', () => {
    let mockCookies: any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockCookies = {
            get: vi.fn(),
            set: vi.fn(),
            delete: vi.fn(),
        };
    });

    it('should successfully refresh the token', async () => {
        const refreshToken = 'valid-refresh-token';
        const newAccessToken = 'new-access-token';
        mockCookies.get.mockReturnValue(refreshToken);

        (fetch as vi.Mock).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ token: newAccessToken }),
        });

        const response = await POST({ cookies: mockCookies } as any);

        expect(mockCookies.get).toHaveBeenCalledWith('refresh_token');
        expect(fetch).toHaveBeenCalledWith(`${PUBLIC_API_URL}/token/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });
        expect(mockCookies.set).toHaveBeenCalledWith('access_token', newAccessToken, expect.any(Object));
        expect(json).toHaveBeenCalledWith({ success: true });
        expect(response).toEqual({ success: true });
    });

    it('should throw 401 if no refresh token is found', async () => {
        mockCookies.get.mockReturnValue(undefined);

        await expect(POST({ cookies: mockCookies } as any)).rejects.toEqual({
            status: 401,
            message: 'No refresh token found'
        });

        expect(error).toHaveBeenCalledWith(401, 'No refresh token found');
        expect(fetch).not.toHaveBeenCalled();
    });

    it('should handle refresh failure from the external API', async () => {
        const refreshToken = 'invalid-refresh-token';
        mockCookies.get.mockReturnValue(refreshToken);

        (fetch as vi.Mock).mockResolvedValue({
            ok: false,
            status: 401,
            json: () => Promise.resolve({ message: 'JWT Refresh Token Not Found' })
        });

        await expect(POST({ cookies: mockCookies } as any)).rejects.toEqual({
            status: 401,
            message: 'JWT Refresh Token Not Found'
        });

        expect(mockCookies.delete).toHaveBeenCalledWith('access_token', { path: '/' });
        expect(mockCookies.delete).toHaveBeenCalledWith('refresh_token', { path: '/' });
        expect(error).toHaveBeenCalledWith(401, 'JWT Refresh Token Not Found');
    });

    it('should handle unexpected errors during fetch', async () => {
        const refreshToken = 'a-valid-token';
        mockCookies.get.mockReturnValue(refreshToken);

        (fetch as vi.Mock).mockRejectedValue(new Error('Network error'));

        await expect(POST({ cookies: mockCookies } as any)).rejects.toEqual({
            status: 500,
            message: 'An unexpected error occurred during token refresh'
        });

        expect(mockCookies.delete).toHaveBeenCalledWith('access_token', { path: '/' });
        expect(mockCookies.delete).toHaveBeenCalledWith('refresh_token', { path: '/' });
        expect(error).toHaveBeenCalledWith(500, 'An unexpected error occurred during token refresh');
    });
});
