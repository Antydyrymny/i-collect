import { useEffect } from 'react';
import { useAppDispatch } from '../../../storeHooks';
import { storeAuth } from './authSlice';
import { authStateKey } from '../../../../data/localStorageKeys';
import { getTypedStorageItem } from '../../../../utils/typesLocalStorage';

export function useAuth() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        const storedAuth = getTypedStorageItem(authStateKey);
        if (storedAuth) dispatch(storeAuth(storedAuth));
    }, [dispatch]);
}
