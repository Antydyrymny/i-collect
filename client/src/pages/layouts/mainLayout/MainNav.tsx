import { Link } from 'react-router-dom';
import { ClientRoutes } from '../../../types';
import { useSelectUser } from '../../../app/services/features/auth';
import { useLogoutMutation } from '../../../app/services/api';
import { ThemeSwitcher } from '../../../contexts/theme';
import { LocalePicker } from '../../../contexts/locale';
import { useLocale } from '../../../contexts/locale';
import { Container, Navbar, Button, Nav, NavbarText } from 'react-bootstrap';
import { HomeButton } from '../../../components';

function MainNav() {
    const t = useLocale('navbar');

    const authState = useSelectUser();
    const [logout] = useLogoutMutation();

    return (
        <Navbar className='mb-5' expand='xl' sticky='top' bg='primary-subtle'>
            <Container className='px-5'>
                <Navbar.Brand>
                    <HomeButton />
                </Navbar.Brand>
                <Nav className='d-xl-none d-flex flex-row'>
                    <LocalePicker />
                    <ThemeSwitcher />
                    <Navbar.Toggle className='ms-5' aria-controls='navbarEexpand' />
                </Nav>
                <Navbar.Collapse id='navbarEexpand' className='justify-content-end gap-3'>
                    <Nav className='d-xl-flex d-none'>
                        <LocalePicker />
                        <ThemeSwitcher />
                    </Nav>
                    <div className='vr d-xl-block d-none' />
                    <Nav className='gap-2'>
                        {!authState._id && (
                            <>
                                <Link to={ClientRoutes.Login}>
                                    <Button className='w-100 h-100 mt-3 mt-xl-0'>
                                        {t('login')}
                                    </Button>
                                </Link>
                                <Link to={ClientRoutes.Register}>
                                    <Button
                                        className='w-100 h-100'
                                        variant='outline-primary'
                                    >
                                        {t('register')}
                                    </Button>
                                </Link>
                            </>
                        )}
                        {authState._id && (
                            <>
                                <NavbarText className='text-capitalize pe-3'>
                                    {authState.name}
                                </NavbarText>
                                {authState.admin && (
                                    <Link to={ClientRoutes.ManageUsers}>
                                        <Button className='w-100 h-100' size='sm'>
                                            {t('users')}
                                        </Button>
                                    </Link>
                                )}
                                <Link to={ClientRoutes.UserPagePath + authState._id}>
                                    <Button className='w-100 h-100' size='sm'>
                                        {t('myPage')}
                                    </Button>
                                </Link>
                                <Button
                                    variant='outline-primary'
                                    onClick={() => logout()}
                                    size='sm'
                                >
                                    {t('logout')}
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default MainNav;
