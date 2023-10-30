import { useEffect } from 'react';
import { useRelogMutation } from '../../api';
import { useAppDispatch } from '../../../storeHooks';
import { storeAuth } from '.';
import { getTypedStorageItem } from '../../../../utils/typesLocalStorage';
import { authStateKey } from '../../../../data/localStorageKeys';

export function useAuth() {
    const dispatch = useAppDispatch();
    const [relog] = useRelogMutation();

    useEffect(() => {
        const storedAuth = getTypedStorageItem(authStateKey, 'sessionStorage');
        if (storedAuth) {
            dispatch(storeAuth(storedAuth));
            relog();
        }
    }, [dispatch, relog]);
}
