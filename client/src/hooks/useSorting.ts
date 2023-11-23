import { useCallback, useMemo, useState } from 'react';

type InitialStateType = { [key: string]: number | Date };

export const useSorting = <T extends InitialStateType>(initialState: T[] = []) => {
    const [sortAscending, setSortAscending] = useState(true);
    const [sortKey, setSortKey] = useState<keyof T>(
        () => Object.keys(initialState[0])?.[0] ?? ''
    );

    const handleSorting = useCallback(
        (key: keyof InitialStateType) => () => {
            if (key === sortKey) setSortAscending((prevSort) => !prevSort);
            else {
                setSortKey(() => key);
                setSortAscending(true);
            }
        },
        [sortKey]
    );

    const sortedState = useMemo(() => {
        initialState.sort((a, b) => {
            if (a[sortKey] < b[sortKey]) return sortAscending ? -1 : 1;
            if (a[sortKey] > b[sortKey]) return sortAscending ? 1 : -1;
            return 0;
        });
    }, [initialState, sortAscending, sortKey]);

    return [sortedState, handleSorting];
};
