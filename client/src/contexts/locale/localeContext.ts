import { createContext } from 'react';
import { Locale } from '../../types';

type LocaleContext = {
    locale: Locale;
    changeLocale: (locale: Locale) => void;
};
export const LocaleContext = createContext<LocaleContext>({
    locale: 'en',
    changeLocale: () => {},
});
