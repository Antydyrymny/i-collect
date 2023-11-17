import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import MainNav from './MainNav';

function MainLayout() {
    return (
        <>
            <MainNav />
            <Container className='mt-5 pb-5'>
                <Outlet />
            </Container>
        </>
    );
}

export default MainLayout;
