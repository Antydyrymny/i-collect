import { Link } from 'react-router-dom';
import { ClientRoutes } from '../../../types';
import { useSelectUser } from '../../../app/services/features/auth';
import { useLogoutMutation } from '../../../app/services/api';
import { useThemeContext } from '../../../contexts/theme';
import { ThemeSwitcher } from '../../../contexts/theme';
import { LocalePicker } from '../../../contexts/locale';
import { useLocale } from '../../../contexts/locale';
import { Container, Navbar, Button, Image, Nav, NavbarText } from 'react-bootstrap';
import logo from '../../../assets/logo.png';
import logoDark from '../../../assets/logo-dark.png';

function MainNav() {
    const t = useLocale('navbar');

    const authState = useSelectUser();
    const [logout] = useLogoutMutation();

    const { theme } = useThemeContext();

    return (
        <Navbar expand='xl' sticky='top' bg='primary-subtle'>
            <Container>
                <Navbar.Brand>
                    <Link
                        to={ClientRoutes.Home}
                        className='d-flex justify-content-center align-items-center gap-2'
                    >
                        {theme === 'light' && <Image src={logo} />}
                        {theme === 'dark' && <Image src={logoDark} />}
                        I-Collect
                    </Link>
                </Navbar.Brand>
                <Nav className='d-xl-none d-flex flex-row'>
                    <LocalePicker />
                    <ThemeSwitcher />
                    <Navbar.Toggle className='ms-5' aria-controls='navbarEexpand' />
                </Nav>
                <Navbar.Collapse className='justify-content-end gap-3'>
                    <Nav className='d-xl-flex d-none'>
                        <LocalePicker />
                        <ThemeSwitcher />
                    </Nav>
                    <div className='vr d-xl-block d-none' />
                    <Nav className='gap-2'>
                        {!authState._id && (
                            <>
                                <Button size='sm'>
                                    <Link to={ClientRoutes.Login}>{t('login')}</Link>
                                </Button>
                                <Button size='sm' variant='outline-primary'>
                                    <Link to={ClientRoutes.Register}>
                                        {t('register')}
                                    </Link>
                                </Button>
                            </>
                        )}
                        {authState._id && (
                            <>
                                <NavbarText className='text-capitalize pe-3'>
                                    {authState.name}
                                </NavbarText>
                                {authState.admin && (
                                    <Button size='sm'>
                                        <Link to={ClientRoutes.ManageUsers}>
                                            {t('users')}
                                        </Link>
                                    </Button>
                                )}
                                <Button size='sm'>
                                    <Link to={ClientRoutes.UserPagePath + authState._id}>
                                        {t('myPage')}
                                    </Link>
                                </Button>
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
