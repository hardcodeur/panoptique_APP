import type { Cookies } from '@sveltejs/kit';

export interface SelectInputValue {
    value: string;
    name: string;
}

export type FormField = 'firstName' | 'lastName' | 'email' | 'phone' | 'role' | 'team';

export type FormSchemas = {
    [key in FormField]?: string;
};


export type ServerEvent = { cookies: Cookies; fetch: typeof fetch };

