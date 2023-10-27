import { useContext } from 'react';
import { LocaleContext } from './localeContext';

export const useLocaleContext = () => useContext(LocaleContext);
