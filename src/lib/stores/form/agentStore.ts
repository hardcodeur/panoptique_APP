import { writable } from 'svelte/store';
import type { FormStore } from '$lib/types';

// Fonction pour créer un nouvel état initial à chaque fois
const getInitialFormState = (): FormStore => ({
    errors: {},
    values: {
        name: '',
        surname: '',
        email: '',
        phone: '',
        role: '',
        team: ''
    }
});

export const formStore = writable<FormStore>(getInitialFormState());

export function resetFormStore(): void {
    formStore.set(getInitialFormState());
}