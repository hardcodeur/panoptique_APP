
import { describe, it, expect, vi } from 'vitest';
import { actions } from './+page.server';
import * as apiAuth from '$lib/api/auth';
import { authUserStore } from '$lib/stores/UserStore';

describe('Login Actions', () => {
    const mockCookies = {
        set: vi.fn(),
    };

    it('should return 400 for invalid form data', async () => {
        const request = new Request('http://localhost/login', {
            method: 'POST',
            body: new URLSearchParams({
                email: 'invalid-email',
                password: 'short'
            })
        });

        const result = await actions.default({ request, cookies: mockCookies });
        expect(result.status).toBe(400);
        expect(result.data.errors.email).toBeDefined();
        expect(result.data.errors.password).toBeDefined();
    });

    it('should return 401 for invalid credentials', async () => {
        vi.spyOn(apiAuth, 'getAuthToken').mockResolvedValue(new Response(null, { status: 401 }));

        const request = new Request('http://localhost/login', {
            method: 'POST',
            body: new URLSearchParams({
                email: 'test@sgs.com',
                password: 'password123'
            })
        });

        const result = await actions.default({ request, cookies: mockCookies });
        expect(result.status).toBe(401);
        expect(result.data.errors._global).toContain('Identifiants invalides');
    });

    it('should return 400 if token or userId is missing from API response', async () => {
        vi.spyOn(apiAuth, 'getAuthToken').mockResolvedValue(
            new Response(JSON.stringify({ userRole: 'agent' }), { status: 200 })
        );

        const request = new Request('http://localhost/login', {
            method: 'POST',
            body: new URLSearchParams({
                email: 'test@sgs.com',
                password: 'password123'
            })
        });

        const result = await actions.default({ request, cookies: mockCookies });
        expect(result.status).toBe(400);
        expect(result.data.error._global).toBeDefined();
    });

    it('should succeed and set cookie on valid login', async () => {
        const token = 'fake-token';
        const userId = 'user-123';
        const userRole = 'admin';

        vi.spyOn(apiAuth, 'getAuthToken').mockResolvedValue(
            new Response(JSON.stringify({ token, userId, userRole }), { status: 200 })
        );
        const authUserStoreSpy = vi.spyOn(authUserStore, 'set');

        const request = new Request('http://localhost/login', {
            method: 'POST',
            body: new URLSearchParams({
                email: 'admin@sgs.com',
                password: 'Password123!'
            })
        });

        const result = await actions.default({ request, cookies: mockCookies });

        expect(result.success).toBe(true);
        expect(mockCookies.set).toHaveBeenCalledWith('auth_token', token, expect.any(Object));
        expect(authUserStoreSpy).toHaveBeenCalled();
    });
    
    it('should return 500 on server error', async () => {
        vi.spyOn(apiAuth, 'getAuthToken').mockRejectedValue(new Error('Server error'));

        const request = new Request('http://localhost/login', {
            method: 'POST',
            body: new URLSearchParams({
                email: 'test@sgs.com',
                password: 'password123'
            })
        });

        const result = await actions.default({ request, cookies: mockCookies });
        expect(result.status).toBe(500);
        expect(result.data.error._global).toContain('Erreur serveur');
    });
});
