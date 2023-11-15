export const getUpdatedFields = <T extends object>(
    originalObj: T,
    editState: Partial<T>
) => {
    type EditState = typeof editState;
    const update: EditState = {};
    let isUpdated = false;

    const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

    getKeys(editState).forEach(<T extends keyof EditState>(key: T) => {
        if (editState[key] && originalObj[key] !== editState[key]) {
            isUpdated = true;
            update[key] = editState[key];
        }
    });

    return isUpdated ? update : false;
};
