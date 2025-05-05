import { writable,get } from 'svelte/store';
import type { AuthUser } from '$lib/types';

const createAuthUserStore = () => {
    const { subscribe, set, update } = writable<AuthUser>({
        userId: "",
        role: ""
    });

    return {
        subscribe,
        set,
        update,
        reset: () => set({ userId: "", role: "" }),
        get: () => get({ subscribe }),
        getUserId: () => get({ subscribe }).userId
    };
};

export const authUserStore = createAuthUserStore();