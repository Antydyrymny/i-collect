import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import MainNav from './MainNav';

function MainLayout() {
    return (
        <div>
            <MainNav />
            <Container className='mt-5'>
                <Outlet />
            </Container>
        </div>
    );
}

export default MainLayout;
