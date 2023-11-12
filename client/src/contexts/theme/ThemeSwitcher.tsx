import { useThemeContext } from '.';
import { ToggleButton, Image } from 'react-bootstrap';
import { nanoid } from '@reduxjs/toolkit';
import light from '../../assets/light.png';
import dark from '../../assets/dark.png';
import sytles from './themeSwitcherStyles.module.scss';
import { useLocale } from '../locale';
import TooltipOverlay from '../../components/tooltip/TooltipOverlay';

export default function ThemeSwitcher() {
    const t = useLocale('theme');
    const { theme, toggleTheme } = useThemeContext();

    return (
        <TooltipOverlay id='theme' tooltipMessage={t(theme)} placement='bottom'>
            <ToggleButton
                value={theme}
                checked={theme === 'light'}
                onChange={toggleTheme}
                type='checkbox'
                id={'ThemeSwitcher' + nanoid()}
                variant={`outline${theme === 'dark' ? '-light' : ''}`}
                className={`${sytles.switcher} d-flex justify-content-center align-items-center`}
            >
                <>
                    {theme === 'light' && <Image src={light} aria-label='light theme' />}
                    {theme === 'dark' && <Image src={dark} aria-label='dark theme' />}
                </>
            </ToggleButton>
        </TooltipOverlay>
    );
}
