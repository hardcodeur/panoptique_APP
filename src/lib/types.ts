import type { Cookies } from '@sveltejs/kit';
import type FormAgent from '$lib/components/form/agents/FormAgent.svelte';
import type FormTeam from '$lib/components/form/Team/FormTeam.svelte';

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

/**
 * Defines the status for toast notifications.
 */
export type ToastStatus = 'success' | 'error' | 'warning' | 'info';

/**
 * Represents the standardized API response object for form submissions.
 */
export interface ApiReturn {
	status: ToastStatus;
	message: string;
}

/**
 * Represents the complete data structure returned by a form action.
 */
export interface FormActionResult {
	apiReturn?: ApiReturn;
	errors?: { [key: string]: string[] | undefined };
	formData?: any;
}

export interface SidebarFormConfig {
	title: string;
	component: AgentFormComponent;
	formReturn: FormActionResult | null;
	itemUpdate?: any;
}