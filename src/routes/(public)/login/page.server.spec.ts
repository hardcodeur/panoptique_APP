import { describe, it, expect, vi, beforeEach } from 'vitest';
import { actions } from './+page.server';
import * as apiAuth from '$lib/api/auth';

// Mock des variables d'environnement privées
vi.mock('$env/static/private', () => ({
    ACCESS_TOKEN_LIFETIME: '900', // 15 minutes
    REFRESH_TOKEN_LIFETIME: '86400' // 24 heures
}));

describe('Login Actions', () => {

    // Créer un mock pour l'objet cookies
    const mockCookies = {
        set: vi.fn(),
    };

    // Réinitialiser les mocks avant chaque test
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return 400 for invalid form data', async () => {
        const request = new Request('http://localhost/login', {
            method: 'POST',
            body: new URLSearchParams({
                email: 'not-an-email',
                password: '' // Mot de passe vide pour déclencher l'erreur
            })
        });

        const result = await actions.default({ request, cookies: mockCookies });
        
        expect(result.status).toBe(400);
        expect(result.data.error.email).toBeDefined();
        expect(result.data.error.password).toBeDefined();
    });

    it('should return 400 on API failure (invalid credentials)', async () => {
        // Simuler l'échec de l'appel API
        vi.spyOn(apiAuth, 'apiAuthToken').mockRejectedValue({
            code: 401,
            message: 'Invalid credentials.'
        });

        const request = new Request('http://localhost/login', {
            method: 'POST',
            body: new URLSearchParams({
                email: 'test@example.com',
                password: 'wrongpassword'
            })
        });

        const result = await actions.default({ request, cookies: mockCookies });

        expect(result.status).toBe(400);
        expect(result.data.error._global).toContain('Identifiant invalide');
    });

    it('should return 400 if tokens are missing from API response', async () => {
        // Simuler une réponse API valide mais sans tokens
        vi.spyOn(apiAuth, 'apiAuthToken').mockResolvedValue({});

        const request = new Request('http://localhost/login', {
            method: 'POST',
            body: new URLSearchParams({
                email: 'test@example.com',
                password: 'password123'
            })
        });

        const result = await actions.default({ request, cookies: mockCookies });
        expect(result.status).toBe(400);
        expect(result.data.error._global).toBeDefined();
    });

    it('should succeed and set cookies correctly on valid login', async () => {
        const fakeToken = 'fake-access-token';
        const fakeRefreshToken = 'fake-refresh-token';

        // Simuler une réponse API réussie
        vi.spyOn(apiAuth, 'apiAuthToken').mockResolvedValue({
            token: fakeToken,
            refresh_token: fakeRefreshToken
        });

        const request = new Request('http://localhost/login', {
            method: 'POST',
            body: new URLSearchParams({
                email: 'test@example.com',
                password: 'password123'
            })
        });

        await actions.default({ request, cookies: mockCookies });

        // Vérifier que cookies.set a été appelé pour l'access token
        expect(mockCookies.set).toHaveBeenCalledWith('access_token', fakeToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 900 // Correspond à ACCESS_TOKEN_LIFETIME mocké
        });

        // Vérifier que cookies.set a été appelé pour le refresh token
        expect(mockCookies.set).toHaveBeenCalledWith('refresh_token', fakeRefreshToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 86400 // Correspond à REFRESH_TOKEN_LIFETIME mocké
        });
    });
    
    it('should return 500 on unexpected server error', async () => {
        // Simuler une erreur générique
        vi.spyOn(apiAuth, 'apiAuthToken').mockRejectedValue(new Error('Something went wrong'));

        const request = new Request('http://localhost/login', {
            method: 'POST',
            body: new URLSearchParams({
                email: 'test@example.com',
                password: 'password123'
            })
        });

        const result = await actions.default({ request, cookies: mockCookies });
        expect(result.status).toBe(500);
        expect(result.data.error._global).toContain('Erreur serveur');
    });
});