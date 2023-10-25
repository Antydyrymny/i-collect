import { createContext } from 'react';
import { ColorTheme } from '../../types';

type ThemeContext = {
    theme: ColorTheme;
    toggleTheme: () => void;
};
export const ThemeContext = createContext<ThemeContext>({
    theme: 'light',
    toggleTheme: () => {},
});
