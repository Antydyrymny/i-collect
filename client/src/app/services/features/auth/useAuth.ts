import { useEffect } from 'react';
import { useLogoutMutation, useStatusOnlineMutation } from '../../api';
import { useSelectUser } from '.';

export function useAuth() {
    const authState = useSelectUser();
    const [relog] = useStatusOnlineMutation();
    const [logout] = useLogoutMutation();

    useEffect(() => {
        if (authState._id) {
            relog();
        }

        const cleanup = () => {
            logout('statusOffline');
        };

        window.addEventListener('beforeunload', cleanup);
        () => {
            window.removeEventListener('beforeunload', cleanup);
        };
    }, [authState._id, logout, relog]);
}
