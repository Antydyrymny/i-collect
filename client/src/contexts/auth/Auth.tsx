import { useEffect } from 'react';
import { useSelectUser } from '../../app/services/features/auth';
import { useAuth } from '../../app/services/features/auth';
import { useAppDispatch } from '../../app/storeHooks';
import { clearAuth } from '../../app/services/features/auth';

export function Auth({ children }: { children: React.ReactNode }) {
    useAuth();
    const authState = useSelectUser();

    const dispatch = useAppDispatch();

    useEffect(() => {
        return () => {
            if (authState._id) {
                dispatch(clearAuth());
            }
        };
    }, [authState._id, dispatch]);

    return <>{children}</>;
}
