import type { Cookies } from '@sveltejs/kit';
import type FormAgent from '$lib/components/form/agents/FormAgent.svelte';
import type FormTeam from '$lib/components/form/Team/FormTeam.svelte';
import type { ActionData } from '../routes/(protected)/agents/$types';

export interface SelectInputValue {
    value: string;
    name: string;
}

export type FormField = 'firstName' | 'lastName' | 'email' | 'phone' | 'role' | 'team';

export type FormSchemas = {
    [key in FormField]?: string;
};


export type ServerEvent = { cookies: Cookies; fetch: typeof fetch };

export type AgentFormComponent = typeof FormAgent | typeof FormTeam;

export interface SidebarFormConfig {
    title: string;
    component: AgentFormComponent;
    formReturn: ActionData | null;
    itemUpdate?: any;
}