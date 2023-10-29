import { useEffect } from 'react';
import { ThemeContext } from '.';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import { colorThemeKey } from '../../data/localStorageKeys';

export default function Theme({ children }: { children: React.ReactNode }) {
    const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const [theme, setTheme] = useLocalStorageState(
        colorThemeKey,
        defaultDark ? 'dark' : 'light'
    );
    const toggleTheme = () =>
        setTheme((curTheme) => (curTheme === 'light' ? 'dark' : 'light'));

    useEffect(() => {
        document.querySelector('body')?.setAttribute('data-bs-theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
