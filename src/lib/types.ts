import type { Cookies } from '@sveltejs/kit';
import type FormAgent from '$lib/components/form/agents/FormAgent.svelte';
import type FormTeam from '$lib/components/form/Team/FormTeam.svelte';
import type FormMission from '$lib/components/form/mission/FormMission.svelte';
import type FormLocation from '$lib/components/form/location/FormLocation.svelte';
import type FormShift from '$lib/components/form/shift/FormShift.svelte';
import type FormProfil from '$lib/components/form/profil/FormProfil.svelte';
import type FormChangePassword from '$lib/components/form/profil/FormChangePassword.svelte';

export interface SelectInputValue {
	value: string;
	name: string;
}

export type roleType = "admin" | "manager" | "team_manager" | "agent"; 

export type FormField = 'firstName' | 'lastName' | 'email' | 'phone' | 'role' | 'team';

export type FormSchemas = {
	[key in FormField]?: string;
};

export type ServerEvent = { cookies: Cookies; fetch: typeof fetch };

export type AgentFormComponent = typeof FormAgent | typeof FormTeam;
export type MissionFormComponent = typeof FormMission | typeof FormLocation | FormShift;
export type ProfilFormComponent = typeof FormProfil | typeof FormChangePassword;

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
	component: AgentFormComponent | MissionFormComponent;
	formReturn: FormActionResult | null;
	itemUpdate?: any;
}