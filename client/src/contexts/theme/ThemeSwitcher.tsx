import { useThemeContext } from '.';
import { ToggleButton, Image } from 'react-bootstrap';
import light from '../../assets/light24.png';
import dark from '../../assets/dark24.png';

export default function ThemeSwitcher() {
    const { theme, toggleTheme } = useThemeContext();

    return (
        <ToggleButton
            value={theme}
            checked={theme === 'light'}
            onChange={toggleTheme}
            type='checkbox'
            id='ThemeSwitcher'
        >
            <>
                {theme === 'light' && <Image src={light} aria-label='light theme' />}
                {theme === 'dark' && <Image src={dark} aria-label='dark theme' />}
            </>
        </ToggleButton>
    );
}
