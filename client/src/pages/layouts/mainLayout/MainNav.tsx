import { Link, useLocation } from 'react-router-dom';
import { ClientRoutes } from '../../../types';
import { useSelectUser } from '../../../app/services/features/auth';
import { useLogoutMutation } from '../../../app/services/api';
import { ThemeSwitcher } from '../../../contexts/theme';
import { LocalePicker } from '../../../contexts/locale';
import { useLocale } from '../../../contexts/locale';
import { Container, Navbar, Button, Nav, NavbarText } from 'react-bootstrap';
import { HomeButton } from '../../../components';
import NavSearchBar from './NavSearchBar';

function MainNav() {
    const t = useLocale('navbar');

    const authState = useSelectUser();
    const [logout] = useLogoutMutation();

    const location = useLocation();
    const showSearchBar = location.pathname !== ClientRoutes.Home;

    return (
        <Navbar className='mb-5 py-3' expand='xl' sticky='top' bg='primary-subtle'>
            <Container className='px-5'>
                <Navbar.Brand>
                    <HomeButton />
                </Navbar.Brand>
                <Nav className='d-xl-none d-flex flex-row'>
                    <LocalePicker />
                    <ThemeSwitcher />
                    <Navbar.Toggle
                        className='ms-lg-5 ms-sm-4 ms-2 px-1'
                        aria-controls='navbarEexpand'
                    />
                </Nav>
                <Navbar.Collapse id='navbarEexpand' className='justify-content-end gap-3'>
                    {showSearchBar && (
                        <Nav className='d-none d-xl-block mx-5 my-0 w-100'>
                            <NavSearchBar />
                        </Nav>
                    )}
                    <Nav className='d-xl-flex d-none'>
                        <LocalePicker />
                        <ThemeSwitcher />
                    </Nav>
                    <div className='vr d-xl-block d-none' />
                    <hr className='d-xl-none d-block my-3' />
                    {showSearchBar && (
                        <Nav className='d-xl-none d-block mb-3'>
                            <NavSearchBar />
                        </Nav>
                    )}
                    <Nav className='gap-2'>
                        {!authState._id && (
                            <>
                                <Link to={ClientRoutes.Login}>
                                    <Button className='w-100 h-100 mt-3 mt-xl-0 text-nowrap'>
                                        {t('login')}
                                    </Button>
                                </Link>
                                <Link to={ClientRoutes.Register}>
                                    <Button
                                        className='w-100 h-100 text-nowrap'
                                        variant='outline-primary'
                                    >
                                        {t('register')}
                                    </Button>
                                </Link>
                            </>
                        )}
                        {authState._id && (
                            <>
                                <NavbarText className='text-capitalize mt-0 pe-3 text-nowrap'>
                                    {authState.name}
                                </NavbarText>
                                {authState.admin && (
                                    <Link to={ClientRoutes.ManageUsers}>
                                        <Button
                                            className='w-100 h-100 text-nowrap'
                                            size='sm'
                                        >
                                            {t('users')}
                                        </Button>
                                    </Link>
                                )}
                                <Link to={ClientRoutes.UserPagePath + authState._id}>
                                    <Button className='w-100 h-100 text-nowrap' size='sm'>
                                        {t('myPage')}
                                    </Button>
                                </Link>
                                <Button
                                    variant='outline-primary'
                                    onClick={() => logout()}
                                    size='sm'
                                    className='text-nowrap mb-xl-0 mb-2'
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
