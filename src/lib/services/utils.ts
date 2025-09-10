
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