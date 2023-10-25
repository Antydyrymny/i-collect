import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import Theme from './contexts/theme/Theme';
import 'bootstrap/dist/css/bootstrap.min.css';

const MainLayoutLazy = React.lazy(() => import('./pages/layouts/mainLayout/MainLayout'));
const HomeLazy = React.lazy(() => import('./pages/home/Home'));
const AuthLayoutLazy = React.lazy(() => import('./pages/layouts/authLayout/AuthLayout'));
const LoginLazy = React.lazy(() => import('./pages/login/Login'));
const RegisterLazy = React.lazy(() => import('./pages/register/Register'));

function App() {
    return (
        <Suspense
            fallback={
                <Container className='vh-100 d-flex justify-content-center align-items-center'>
                    <Spinner variant='warning' />
                </Container>
            }
        >
            <Theme>
                <Routes>
                    <Route path='/' element={<MainLayoutLazy />}>
                        <Route index element={<HomeLazy />} />
                    </Route>
                    <Route element={<AuthLayoutLazy />}>
                        <Route path='/login' element={<LoginLazy />} />
                        <Route path='/register' element={<RegisterLazy />} />
                    </Route>
                    <Route path='*' element={<Navigate to={'/'} replace />} />
                </Routes>
            </Theme>
        </Suspense>
    );
}

export default App;
