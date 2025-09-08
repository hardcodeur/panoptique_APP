
export function getChangedFields(originalData: any, newData: any): { [key: string]: any } {
    const changedFields: { [key: string]: any } = {};
    for ( let key in newData) {
        if (key !== 'id' && originalData.hasOwnProperty(key) && originalData[key] !== newData[key]) {
            changedFields[key] = newData[key];
        }
    }
    return changedFields;
}