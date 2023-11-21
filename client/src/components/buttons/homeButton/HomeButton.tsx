import { TooltipOverlay } from '../..';
import { Link } from 'react-router-dom';
import { ClientRoutes } from '../../../types';
import { useThemeContext } from '../../../contexts/theme';
import { useLocale } from '../../../contexts/locale';
import { Image } from 'react-bootstrap';
import logo from '../../../assets/logo.png';
import logoDark from '../../../assets/logo-dark.png';

function HomeButton() {
    const { theme } = useThemeContext();
    const t = useLocale('navbar');

    return (
        <TooltipOverlay id='home' tooltipMessage={t('home')} placement='bottom'>
            <Link
                to={ClientRoutes.Home}
                className='d-flex justify-content-center align-items-center gap-2'
            >
                {theme === 'light' && <Image src={logo} />}
                {theme === 'dark' && <Image src={logoDark} />}
                I-Collect
            </Link>
        </TooltipOverlay>
    );
}

export default HomeButton;
