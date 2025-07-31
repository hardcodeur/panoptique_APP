
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from './apiClient';
import { PUBLIC_API_URL } from '$env/static/public';

// Mocking fetch
global.fetch = vi.fn();

describe('apiClient', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should perform a GET request', async () => {
        const mockData = { message: 'Success' };
        (fetch as vi.Mock).mockResolvedValue({
            ok: true,
            text: () => Promise.resolve(JSON.stringify(mockData)),
        });

        const data = await apiClient.get('/test');

        expect(fetch).toHaveBeenCalledWith(`${PUBLIC_API_URL}/test`, expect.any(Object));
        expect(fetch as vi.Mock).toHaveBeenCalledTimes(1);
        const fetchOptions = (fetch as vi.Mock).mock.calls[0][1];
        expect(fetchOptions.method).toBe('GET');
        expect(data).toEqual(mockData);
    });

    it('should perform a POST request with a body', async () => {
        const mockData = { id: 1, name: 'Test' };
        const body = { name: 'Test' };
        (fetch as vi.Mock).mockResolvedValue({
            ok: true,
            text: () => Promise.resolve(JSON.stringify(mockData)),
        });

        const data = await apiClient.post('/test', body);

        expect(fetch).toHaveBeenCalledWith(`${PUBLIC_API_URL}/test`, expect.any(Object));
        const fetchOptions = (fetch as vi.Mock).mock.calls[0][1];
        expect(fetchOptions.method).toBe('POST');
        expect(fetchOptions.body).toBe(JSON.stringify(body));
        expect(data).toEqual(mockData);
    });

    it('should handle token refresh and retry the request', async () => {
        const expiredTokenResponse = {
            ok: false,
            status: 401,
            text: () => Promise.resolve(JSON.stringify({ code: 401, message: 'Expired JWT Token' })),
        };
        const successResponse = {
            ok: true,
            text: () => Promise.resolve(JSON.stringify({ message: 'Success after refresh' })),
        };
        const refreshResponse = {
            ok: true,
            text: () => Promise.resolve('{}'), // Empty object for refresh response
        };

        (fetch as vi.Mock)
            .mockResolvedValueOnce(expiredTokenResponse as any)
            .mockResolvedValueOnce(refreshResponse as any)
            .mockResolvedValueOnce(successResponse as any);

        const data = await apiClient.get('/protected-resource');

        expect(fetch).toHaveBeenCalledTimes(3);
        
        expect((fetch as vi.Mock).mock.calls[0][0]).toBe(`${PUBLIC_API_URL}/protected-resource`);
        expect((fetch as vi.Mock).mock.calls[1][0]).toBe('/api/refresh');
        expect((fetch as vi.Mock).mock.calls[2][0]).toBe(`${PUBLIC_API_URL}/protected-resource`);
        
        expect(data).toEqual({ message: 'Success after refresh' });
    });

    it('should queue requests while token is refreshing', async () => {
        const expiredTokenResponse = {
            ok: false,
            status: 401,
            text: () => Promise.resolve(JSON.stringify({ code: 401, message: 'Expired JWT Token' })),
        };
        const successResponse = {
            ok: true,
            text: () => Promise.resolve(JSON.stringify({ message: 'Success' })),
        };
        const refreshResponse = {
            ok: true,
            text: () => Promise.resolve('{}'),
        };

        let refreshAttempted = false;

        (fetch as vi.Mock).mockImplementation(async (url: string) => {
            if (url.includes('/api/refresh')) {
                refreshAttempted = true;
                return refreshResponse;
            }
            
            if (!refreshAttempted) {
                return expiredTokenResponse;
            }
            
            return successResponse;
        });

        const promise1 = apiClient.get('/resource1');
        const promise2 = apiClient.get('/resource2');

        const [data1, data2] = await Promise.all([promise1, promise2]);

        // 2 initial calls (fail), 1 refresh call, 2 retried calls
        expect((fetch as vi.Mock).mock.calls.length).toBe(5);
        expect(data1).toEqual({ message: 'Success' });
        expect(data2).toEqual({ message: 'Success' });
    });

    it('should reject requests if token refresh fails', async () => {
        const expiredTokenResponse = {
            ok: false,
            status: 401,
            text: () => Promise.resolve(JSON.stringify({ code: 401, message: 'Expired JWT Token' })),
        };
        const refreshFailedResponse = {
            ok: false,
            status: 500,
        };

        (fetch as vi.Mock)
            .mockResolvedValueOnce(expiredTokenResponse as any)
            .mockResolvedValueOnce(refreshFailedResponse as any);

        await expect(apiClient.get('/protected-resource')).rejects.toThrow('Failed to refresh token');
    });
});
