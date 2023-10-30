import { Navigate } from 'react-router-dom';
import { useSelectUser } from '.';
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
    const authState = useSelectUser();
    const isAuthenticated = !!authState._id;
    const isAdmin = isAuthenticated && authState.admin;
    const protectedCondition = adminRoute ? isAdmin : isAuthenticated;

    return protectedCondition ? <Component /> : <Navigate to={redirectRoute} replace />;
}

export default ProtectedRoute;
