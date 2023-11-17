import { useState, useCallback } from 'react';
import { ItemFormatField } from '../types';

/**
 * Handlers for working with item updates
 * @param defaultName default item.name state
 * @param defaultItemFields default item.fields state - if no state - provide state initializer
 * @returns
 * @name state variable
 * @handleNameChange function to update name
 * @fields state array of item fields
 * @handleFieldChange function to update item fields
 * @resetState function to return state to its default
 */
export const useItemHandlers = (
    defaultName: string,
    defaultItemFields: ItemFormatField[] | (() => ItemFormatField[])
) => {
    const [name, setName] = useState(defaultName);
    const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }, []);

    const [fields, setFields] = useState<ItemFormatField[]>(defaultItemFields);
    const handleFieldChange = useCallback(
        (ind: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setFields((prevFields) =>
                prevFields.map((field, fieldInd) =>
                    fieldInd === ind
                        ? {
                              ...field,
                              fieldValue:
                                  field.fieldType === 'boolean'
                                      ? e.target.checked
                                      : e.target.value,
                          }
                        : { ...field }
                )
            );
        },
        []
    );

    const resetState = useCallback(() => {
        setName(defaultName);
        setFields(defaultItemFields);
    }, [defaultItemFields, defaultName]);

    return { name, handleNameChange, fields, handleFieldChange, resetState };
};
