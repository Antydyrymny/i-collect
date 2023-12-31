import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import ProtectedRoute from './app/services/features/auth';
import AllContexts from './contexts/AllContexts';
import { ClientRoutes } from './types';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const UserPage = React.lazy(() => import('./pages/userPage/UserPage'));
const NewCollection = React.lazy(
    () => import('./pages/collection/newCollection/NewCollection')
);
const CollectionLayout = React.lazy(
    () => import('./pages/layouts/collectionLayout/CollectionLayout')
);
const CollectionPage = React.lazy(() => import('./pages/collection/CollectionPage'));
const NewItem = React.lazy(() => import('./pages/item/newItem/NewItem'));
const ItemPage = React.lazy(() => import('./pages/item/ItemPage'));

const MainLayout = React.lazy(() => import('./pages/layouts/mainLayout/MainLayout'));
const Home = React.lazy(() => import('./pages/home/Home'));
const ManageUsers = React.lazy(() => import('./pages/manageUsers/ManageUsers'));

const AuthLayout = React.lazy(() => import('./pages/layouts/authLayout/AuthLayout'));
const Login = React.lazy(() => import('./pages/login/Login'));
const Register = React.lazy(() => import('./pages/register/Register'));

function App() {
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
                    <Route path={ClientRoutes.Home} element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route path={ClientRoutes.UserPage}>
                            <Route
                                index
                                element={<ProtectedRoute Component={UserPage} />}
                            />
                            <Route
                                path={ClientRoutes.NewCollection}
                                element={<ProtectedRoute Component={NewCollection} />}
                            />
                        </Route>
                        <Route
                            path={ClientRoutes.CollectionPage}
                            element={<CollectionLayout />}
                        >
                            <Route index element={<CollectionPage />} />
                            <Route
                                path={ClientRoutes.NewItem}
                                element={<ProtectedRoute Component={NewItem} />}
                            />
                        </Route>
                        <Route path={ClientRoutes.ItemPage} element={<ItemPage />} />
                        <Route
                            path={ClientRoutes.ManageUsers}
                            element={
                                <ProtectedRoute Component={ManageUsers} adminRoute />
                            }
                        />
                    </Route>
                    <Route element={<AuthLayout />}>
                        <Route path={ClientRoutes.Login} element={<Login />} />
                        <Route path={ClientRoutes.Register} element={<Register />} />
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
