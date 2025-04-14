import { persisted } from 'svelte-persisted-store';
import { get } from 'svelte/store';

const auth = persisted('authState', {
    isAuth: false,
});


// Fonctions wrapper pour une API similaire
export const login = () => {
    auth.update(state => ({
        ...state,
        isAuth: true,
    }));
}

export const logout = () => {
    auth.update(state => ({
        ...state,
        isAuth: false
    }));
}

export const isAuth  = () => {
    get(auth).isAuth;
}