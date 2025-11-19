import { redirect, type Cookies } from "@sveltejs/kit";

export function getChangedFields<T extends Record<string, any>>(originalData: T,newData: T): Partial<T> 
{
	const changedFields: Partial<T> = {};

	for (const key in newData) {
		if (key !== 'id' && Object.prototype.hasOwnProperty.call(newData, key)) {
			const originalValue = originalData[key];
			const newValue = newData[key];

			// Handle arrays
			if (Array.isArray(originalValue) && Array.isArray(newValue)) {
				// Compare stringified versions for deep comparison of array content
				if (JSON.stringify(originalValue) !== JSON.stringify(newValue)) {
					changedFields[key] = newValue;
				}
			} else if (originalValue !== newValue) {
				// Handle other types (primitives, objects - shallow comparison for objects)
				changedFields[key] = newValue;
			}
		}
	}

	return changedFields;
}

// delete all auth cookie and redirect
export function logout(cookies: Cookies) {
    cookies.delete("access_token", { 
        path: "/",
        domain: '.panoptique.online'
    });
    cookies.delete("refresh_token", { 
        path: "/",
        domain: '.panoptique.online'
    });
    throw redirect(303, '/login');
}