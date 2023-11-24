import { EditedFormatField, FormatFieldUpdate } from '../types';

export const getUpdatedOptionalFields = (
    initialState: EditedFormatField[],
    editedFields: EditedFormatField[]
): FormatFieldUpdate[] => {
    const update: FormatFieldUpdate[] = [];

    editedFields.forEach((field) => {
        const existingFieldInd = initialState.findIndex(
            (iField) => iField.id === field.id
        );
        if (existingFieldInd === -1)
            update.push({
                action: 'add',
                fieldName: field.fieldName,
                fieldType: field.fieldType,
            });
        else {
            if (field.fieldName !== initialState[existingFieldInd].fieldName)
                update.push({
                    action: 'rename',
                    fieldName: initialState[existingFieldInd].fieldName,
                    fieldType: field.fieldType,
                    newName: field.fieldName,
                });
        }
    });

    initialState.forEach((iField) => {
        if (editedFields.findIndex((field) => field.id === iField.id) === -1)
            update.push({
                action: 'delete',
                fieldName: iField.fieldName,
                fieldType: iField.fieldType,
            });
    });

    return update;
};
