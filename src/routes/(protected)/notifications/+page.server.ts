import type { PageServerLoad } from "./$types";
import type { ApiReturn } from '$lib/types';
import { fail,error } from '@sveltejs/kit';

import { getNotificationByUser } from "$lib/api/notification"
import { loadNotifications } from "$lib/stores/notificationStore";

export const load: PageServerLoad = async ({ cookies, fetch, parent }) => {
    try {
        const { user } = await parent();

        if (!user || !user.id) {
            throw error(401, 'Utilisateur non authentifié ou identifiant manquant');
        }

        const notifications = await getNotificationByUser(user.id, { cookies, fetch });
        //Store
        return { notifications };

    } catch (err: any) {
        console.error("Erreur dans le chargement des notifications :", err);
        throw error(err.status || 500, err.body?.message || 'Erreur lors du chargement des notifications');
    }
}