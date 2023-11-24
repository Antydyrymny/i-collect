import { useCallback, useEffect, useState } from 'react';
import { EditedFormatField } from '../types';
import { nanoid } from '@reduxjs/toolkit';

export const useCollectionOptionalFields = (defaultState: EditedFormatField[]) => {
    const [optionalFields, setOptionalFields] = useState(defaultState);

    useEffect(() => {
        setOptionalFields(defaultState);
    }, [defaultState]);

    const addOptionalField = useCallback(() => {
        setOptionalFields((fields) => [
            ...fields,
            { id: nanoid(), new: true, fieldName: '', fieldType: 'string' },
        ]);
    }, []);

    const deleteOptionalField = useCallback(
        (id: string) => () => {
            setOptionalFields((fields) => fields.filter((field) => field.id !== id));
        },
        []
    );

    const changeOptionalFields = useCallback(
        <T extends 'name' | 'type'>(id: string, fieldParam: T) =>
            (
                e: T extends 'name'
                    ? React.ChangeEvent<HTMLInputElement>
                    : React.ChangeEvent<HTMLSelectElement>
            ) => {
                setOptionalFields((fields) =>
                    fields.map((field) =>
                        field.id === id
                            ? {
                                  ...field,
                                  [fieldParam === 'name' ? 'fieldName' : 'fieldType']:
                                      e.target.value,
                              }
                            : { ...field }
                    )
                );
            },
        []
    );

    const resetOptionalFields = useCallback(() => {
        setOptionalFields(defaultState);
    }, [defaultState]);

    return {
        optionalFields,
        addOptionalField,
        deleteOptionalField,
        changeOptionalFields,
        resetOptionalFields,
    };
};
