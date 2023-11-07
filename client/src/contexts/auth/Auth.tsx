import { useAuth } from '../../app/services/features/auth';

export function Auth({ children }: { children: React.ReactNode }) {
    useAuth();

    return <>{children}</>;
}
