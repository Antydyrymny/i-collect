import { useEffect } from 'react';
import { useAppDispatch } from '../../app/storeHooks';
import { useSelectUser } from '../../app/services/features/auth';
import { clearAuth, useAuth } from '../../app/services/features/auth';
import { useLogoutMutation } from '../../app/services/api';

export function Auth({ children }: { children: React.ReactNode }) {
    useAuth();
    const authState = useSelectUser();

    const dispatch = useAppDispatch();
    const [logout] = useLogoutMutation();

    useEffect(() => {
        return () => {
            if (authState._id) {
                logout();
                dispatch(clearAuth());
            }
        };
    }, [authState._id, dispatch, logout]);

    return <>{children}</>;
}
