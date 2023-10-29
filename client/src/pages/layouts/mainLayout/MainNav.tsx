import { Link } from 'react-router-dom';
import { ClientRoutes } from '../../../types';
import { useSelectUser } from '../../../app/services/features/auth';
import { useLogoutMutation } from '../../../app/services/api';
import { useThemeContext } from '../../../contexts/theme';
import { ThemeSwitcher } from '../../../contexts/theme';
import { LocalePicker } from '../../../contexts/locale';
import { useLocale } from '../../../contexts/locale';
import { Container, Navbar, Button, Image, Nav } from 'react-bootstrap';
import logo from '../../../assets/logo.png';
import logoDark from '../../../assets/logo-dark.png';

function MainNav() {
    const t = useLocale;

    const authState = useSelectUser();
    const [logout] = useLogoutMutation();

    const { theme } = useThemeContext();

    return (
        <Navbar sticky='top' bg='primary-subtle'>
            <Container className='d-flex justify-content-space-between'>
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
                <Nav className='d-flex gap-4'>
                    <Navbar.Collapse>
                        <LocalePicker />
                        <ThemeSwitcher />
                    </Navbar.Collapse>
                    <div className='vr' />
                    <Nav className='gap-2'>
                        {!authState.name && (
                            <>
                                <Button size='sm'>
                                    <Link to={ClientRoutes.Login}>Sign in</Link>
                                </Button>
                                <Button size='sm'>
                                    <Link to={ClientRoutes.Register}>Sign up</Link>
                                </Button>
                            </>
                        )}
                        {authState.name && (
                            <>
                                {authState.admin && (
                                    <Button size='sm'>
                                        <Link to={ClientRoutes.ManageUsers}>Users</Link>
                                    </Button>
                                )}
                                <Button size='sm'>
                                    <Link to={ClientRoutes.UserPage}>My Collections</Link>
                                </Button>
                                <Button onClick={() => logout()} size='sm'>
                                    Logout
                                </Button>
                            </>
                        )}
                    </Nav>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default MainNav;
