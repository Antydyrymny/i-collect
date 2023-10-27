import { useEffect } from 'react';
import { useAppDispatch } from '../../app/storeHooks';
import { clearAuth, useAuth } from '../../app/services/features/auth';
import { useLogoutMutation } from '../../app/services/api';

export function Auth({ children }: { children: React.ReactNode }) {
    useAuth();

    const dispatch = useAppDispatch();
    const [logout] = useLogoutMutation();

    useEffect(() => {
        return () => {
            logout();
            dispatch(clearAuth());
        };
    }, [dispatch, logout]);

    return <>{children}</>;
}
