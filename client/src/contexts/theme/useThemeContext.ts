import { useContext } from 'react';
import { ThemeContext } from './themeContext';

export const useThemeContext = () => useContext(ThemeContext);
