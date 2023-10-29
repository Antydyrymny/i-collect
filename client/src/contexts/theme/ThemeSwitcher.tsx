import { useThemeContext } from '.';
import { ToggleButton, Image } from 'react-bootstrap';
import light from '../../assets/light.png';
import dark from '../../assets/dark.png';
import sytles from './themeSwitcherStyles.module.scss';

export default function ThemeSwitcher() {
    const { theme, toggleTheme } = useThemeContext();

    return (
        <ToggleButton
            value={theme}
            checked={theme === 'light'}
            onChange={toggleTheme}
            type='checkbox'
            id='ThemeSwitcher'
            variant={`outline${theme === 'dark' ? '-light' : ''}`}
            className={`${sytles.switcher} d-flex justify-content-center align-items-center`}
        >
            <>
                {theme === 'light' && <Image src={light} aria-label='light theme' />}
                {theme === 'dark' && <Image src={dark} aria-label='dark theme' />}
            </>
        </ToggleButton>
    );
}
