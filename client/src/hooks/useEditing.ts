import { useCallback, useState } from 'react';

/**
 * Functions to handle editing components
 * @param allowEdit will not allow starting edit if false, defaults to true
 * @param resetState function to reset the edit state on canceling
 * @returns
 * @editing boolean state
 * @onChange function to handle editing change
 * @stopEditing function to stop edit
 */
export const useEditing = (allowEdit: boolean = true, resetState: () => void) => {
    const [editing, setEditing] = useState(false);
    const onChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!editing && !allowEdit) return;
            if (editing) resetState();
            setEditing(e.target.checked);
        },
        [allowEdit, editing, resetState]
    );

    const stopEditing = useCallback(() => {
        setEditing(false);
    }, []);
    return { editing, onChange, stopEditing };
};
