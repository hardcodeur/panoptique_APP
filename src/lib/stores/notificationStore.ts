import { writable } from 'svelte/store';

export interface Notification {
	id: string;
	text: string;
	createdAt: string
}

export const notificationList = writable<Notification[]>([]);

export function loadNotifications(initialNotifications: Notification[]) {
	notificationList.set(initialNotifications);
}

export async function dismissNotification(id: string) {
	notificationList.update((all) => all.filter((n) => n.id !== id));

	try {
		await fetch(`/api/notifications/${id}`, {
			method: 'DELETE'
		});
	} catch (error) {
		console.error("La mise à jour de la notification sur le serveur a échoué :", error);
	}
}
