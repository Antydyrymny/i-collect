import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import ProtectedRoute, { useAuth } from './app/services/features/auth';
import AllContexts from './contexts/AllContexts';
import { ClientRoutes } from './types';
import 'bootstrap/dist/css/bootstrap.min.css';

const MainLayoutLazy = React.lazy(() => import('./pages/layouts/mainLayout/MainLayout'));
const HomeLazy = React.lazy(() => import('./pages/home/Home'));
const UserPageLazy = React.lazy(() => import('./pages/userPage/UserPage'));
const ManageUsersLazy = React.lazy(() => import('./pages/manageUsers/ManageUsers'));

const AuthLayoutLazy = React.lazy(() => import('./pages/layouts/authLayout/AuthLayout'));
const LoginLazy = React.lazy(() => import('./pages/login/Login'));
const RegisterLazy = React.lazy(() => import('./pages/register/Register'));

function App() {
    useAuth();

    return (
        <Suspense
            fallback={
                <Container className='vh-100 d-flex justify-content-center align-items-center'>
                    <Spinner />
                </Container>
            }
        >
            <AllContexts>
                <Routes>
                    <Route path={ClientRoutes.Home} element={<MainLayoutLazy />}>
                        <Route index element={<HomeLazy />} />
                        <Route
                            path={ClientRoutes.UserPage}
                            element={<ProtectedRoute Component={UserPageLazy} />}
                        />
                        <Route
                            path={ClientRoutes.UserPage}
                            element={
                                <ProtectedRoute Component={ManageUsersLazy} adminRoute />
                            }
                        />
                    </Route>
                    <Route element={<AuthLayoutLazy />}>
                        <Route path={ClientRoutes.Login} element={<LoginLazy />} />
                        <Route path={ClientRoutes.Register} element={<RegisterLazy />} />
                    </Route>
                    <Route
                        path='*'
                        element={<Navigate to={ClientRoutes.Home} replace />}
                    />
                </Routes>
            </AllContexts>
        </Suspense>
    );
}

export default App;
