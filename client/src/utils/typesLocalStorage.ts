import type { LocalStorageSchema } from '../types';

type StorageVariant = 'localStorage' | 'sessionStorage';
export const setTypedStorageItem = <T extends keyof LocalStorageSchema>(
    key: T,
    value: LocalStorageSchema[T],
    variant: StorageVariant = 'localStorage'
): void => {
    if (variant === 'localStorage')
        window.localStorage.setItem(key, JSON.stringify(value));
    else window.sessionStorage.setItem(key, JSON.stringify(value));
};

export const getTypedStorageItem = <T extends keyof LocalStorageSchema>(
    key: T,
    variant: StorageVariant = 'localStorage'
): LocalStorageSchema[T] | null => {
    const stringifiedItem =
        variant === 'localStorage'
            ? window.localStorage.getItem(key)
            : window.sessionStorage.getItem(key);
    return stringifiedItem
        ? (JSON.parse(stringifiedItem) as LocalStorageSchema[T])
        : null;
};
