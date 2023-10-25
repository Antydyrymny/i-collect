import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import { getTypedStorageItem, setTypedStorageItem } from '../utils/typesLocalStorage';
import { LocalStorageSchema } from '../types';
/**
 * saves state in localStorage
 * @param initialState initial state value to save
 * @param key string by which state is saved to localStorage
 * @returns array of values:
 * @state react state,
 * @setState react setState,
 * @clearLocalStorage function to clear entry from localStorage
 */
export function useLocalStorageState<T extends keyof LocalStorageSchema>(
    key: T,
    initialState: LocalStorageSchema[T]
): [
    LocalStorageSchema[T],
    Dispatch<SetStateAction<LocalStorageSchema[T]>>,
    VoidFunction
] {
    const initializer = (): LocalStorageSchema[T] => {
        const storedValue = getTypedStorageItem(key);
        return storedValue ? storedValue : initialState;
    };
    const [state, setState] = useState(() => initializer());

    useEffect(() => setTypedStorageItem(key, state), [state, key]);
    const clearLocalStorage = useCallback(
        () => window.localStorage.removeItem(key),
        [key]
    );

    return [state, setState, clearLocalStorage];
}
