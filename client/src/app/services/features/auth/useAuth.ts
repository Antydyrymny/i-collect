import { useEffect } from 'react';
import { storeAuth } from '.';
import { useAppDispatch } from '../../../storeHooks';
import { authStateKey } from '../../../../data/localStorageKeys';
import { getTypedStorageItem } from '../../../../utils/typesLocalStorage';

export function useAuth() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        const storedAuth = getTypedStorageItem(authStateKey);
        if (storedAuth) dispatch(storeAuth(storedAuth));
    }, [dispatch]);
}
