import { Outlet } from 'react-router-dom';
import { useRedirect } from '../../../hooks/useRedirect';
import { useSelectUser } from '../../../app/services/features/auth';
import { LocalePicker } from '../../../contexts/locale';
import { Card, Col, Container, Navbar, Row } from 'react-bootstrap';
import styles from './authStyle.module.scss';

function AuthLayout() {
    useRedirect(!!useSelectUser().name);

    return (
        <Container className='vh-100 d-flex flex-column justify-content-center align-items-center'>
            <Navbar expand='lg' className={`${styles.nav} position-fixed top-0`}>
                <LocalePicker />
            </Navbar>
            <Container>
                <Row className='d-flex justify-content-center align-items-center'>
                    <Col md={8} lg={6} xs={12}>
                        <Card className={`${styles.card} shadow`}>
                            <Card.Body>
                                <div className='mb-3 mt-md-4'>
                                    <Outlet />
                                </div>
                            </Card.Body>
                        </Card>
                        <div className={`${styles.smallCard} mb-3 mt-md-4`}>
                            <Outlet />
                        </div>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default AuthLayout;
