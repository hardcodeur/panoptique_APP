import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { logout } from "$lib/services/utils";


export const POST: RequestHandler = async ({ cookies }) => {
    logout(cookies);
    return json({ success: true });
};