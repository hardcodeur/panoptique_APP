import { writable } from 'svelte/store';
import type { AuthUser } from '$lib/types';

const getInitialAuthUserState = (): AuthUser => ({
    userId : "",
    role : "",
});

export const authUserStore = writable<AuthUser>(getInitialAuthUserState());

export function resetAuthUserStore(): void {    
    authUserStore.set(getInitialAuthUserState());
}