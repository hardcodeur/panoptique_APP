// src/routes/(protected)/+layout.server.ts

import type{ Cookies } from "@sveltejs/kit";
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { PUBLIC_API_URL } from '$env/static/public';
import { ACCESS_TOKEN_LIFETIME } from '$env/static/private';
import { logout } from "$lib/services/utils.js";
import { countNewNotification } from "$lib/api/notification";

// get public signature key
const publicKey = fs.readFileSync(path.resolve('./key/public.pem'));

export async function load({ cookies, fetch }) {
    
    const refreshToken = cookies.get("refresh_token");
    const accessToken = cookies.get("access_token");
    let userPayload = null;

    // no refresh no session
    if (!refreshToken) {
        return logout(cookies);
    }

    if (accessToken) {
        try {
            // Check the signature of token for security the cookie of access token is not http only
            const payload = jwt.verify(accessToken, publicKey, { algorithms: ['RS256'] });
            
            if (typeof payload === 'object') {
                userPayload = {
                    "id": payload.id,
                    "email": payload.userEmail,
                    "fullName": payload.userName,
                    "role": payload.role,
                };
            }
        } catch (error) {
            console.log("Access token expiré");
        }
    }

    // if userPayload is null, access token not exist, i make a refresh
    if (!userPayload) {
        try {
            const newAccessToken = await makeRefreshToken(cookies, refreshToken);            

            // Check the signature of token for security the cookie of access token is not http only
            const newPayload = jwt.verify(newAccessToken, publicKey, { algorithms: ['RS256'] });

            if (typeof newPayload !== 'object') {
                throw new Error("Le nouveau token reçu de l'API est malformé.");
            }

            userPayload = {
                    "id": newPayload.id,
                    "email": newPayload.userEmail,
                    "fullName": newPayload.userName,
                    "role": newPayload.role,
            };

        } catch (refreshError: any) {            
            // refresh fail disconnection
            console.error("Échec : le rafraîchissement du token a échoué déconnexion.", refreshError.message);
            return logout(cookies);
        }
    }

    const [
        nbNewNotification,
    ] = await Promise.all([
        countNewNotification({ cookies, fetch }),
    ]);
    
    // return user
    return { user: userPayload,nbNewNotification };
}

// call Api and replaces access token
async function makeRefreshToken(cookies: Cookies, refreshToken: string) {
    
    const config = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
    }
    const response = await fetch(`${PUBLIC_API_URL}/token/refresh`,config);
    
    if (!response.ok) {
        throw new Error("L'API n'as pas reussit à rafraichire le token");
    }

    const { token: newAccessToken } = await response.json();

    // add cookie with the new access token, cookie public
    cookies.set('access_token', newAccessToken, {
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: parseInt(ACCESS_TOKEN_LIFETIME, 10)
    });

    return newAccessToken
}