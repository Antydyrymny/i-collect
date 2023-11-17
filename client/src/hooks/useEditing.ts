import { useCallback, useState } from 'react';

/**
 * Functions to handle editing components
 * @param allowEdit will not allow starting edit if false, defaults to true
 * @param resetState function to reset the edit state on canceling
 * @returns
 * @editing boolean state
 * @startEditing function to start edit
 * @stopEditing function to stop edit
 */
export const useEditing = (allowEdit: boolean = true) => {
    const [editing, setEditing] = useState(false);

    const startEditing = useCallback(() => {
        if (!allowEdit) return;
        setEditing(true);
    }, [allowEdit]);

    const stopEditing = useCallback(() => {
        setEditing(false);
    }, []);
    return { editing, startEditing, stopEditing };
};
