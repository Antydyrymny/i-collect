import { Outlet } from 'react-router-dom';
import { useRedirect } from '../../../hooks/useRedirect';
import { useSelectUser } from '../../../app/services/features/auth';
import { LocalePicker } from '../../../contexts/locale';
import { Container, Nav } from 'react-bootstrap';
import styles from './authStyle.module.scss';

function AuthLayout() {
    useRedirect(!!useSelectUser().name);

    return (
        <Container
            className={`vh-100 d-flex flex-column justify-content-center align-items-center`}
        >
            <Nav className={`${styles.nav} position-fixed top-0`}>
                <LocalePicker />
            </Nav>
            <Outlet />
        </Container>
    );
}

export default AuthLayout;
