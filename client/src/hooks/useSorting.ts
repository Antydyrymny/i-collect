import { useCallback, useMemo, useState } from 'react';
import { ItemPreview } from '../types';

/**
 * Utils for sorting item previews
 * @param initialItems array of ItemPreview
 * @returns
 * @sortAscending boolean
 * @sortKey string by which array is currently sorted
 * @sortedItems sorted array to display
 * @handleSorting onClick handler for item headings
 */
export const useItemSorting = (initialItems: ItemPreview[]) => {
    const [sortAscending, setSortAscending] = useState(true);
    const [sortKey, setSortKey] = useState('name');

    const sortedItems = useMemo(
        () =>
            initialItems.slice().sort((a, b) => {
                if (sortKey === 'name') {
                    if (a.name < b.name) return sortAscending ? -1 : 1;
                    else return sortAscending ? 1 : -1;
                } else {
                    const getInd = (sortable: ItemPreview) =>
                        sortable.fields.findIndex((field) => field.fieldName === sortKey);

                    if (a.fields[getInd(a)]?.fieldValue < b.fields[getInd(b)]?.fieldValue)
                        return sortAscending ? -1 : 1;
                    else return sortAscending ? 1 : -1;
                }
            }),
        [initialItems, sortAscending, sortKey]
    );

    const handleSorting = useCallback(
        (key: string) => () => {
            if (key === sortKey) setSortAscending((prevSort) => !prevSort);
            else {
                setSortKey(() => key);
                setSortAscending(false);
            }
        },
        [sortKey]
    );

    return { sortAscending, sortKey, sortedItems, handleSorting };
};
