import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../../storeHooks';
import { selectCurrentUser } from '.';
import { ClientRoutes } from '../../../../types';

type ProtectedRouteProps = {
    Component: React.FunctionComponent;
    adminRoute?: boolean;
    redirectRoute?: string;
};

function ProtectedRoute({
    Component,
    adminRoute = false,
    redirectRoute = ClientRoutes.Login,
}: ProtectedRouteProps) {
    const isAuthenticated = useAppSelector(selectCurrentUser);
    const isAdmin = isAuthenticated && isAuthenticated.admin;
    const protectedCondition = adminRoute ? isAdmin : isAuthenticated;

    return protectedCondition ? <Component /> : <Navigate to={redirectRoute} replace />;
}

export default ProtectedRoute;
