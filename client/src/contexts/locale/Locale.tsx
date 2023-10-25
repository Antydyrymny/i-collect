import { LocaleContext } from './localeContext';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import { localeKey } from '../../data/localStorageKeys';
import { Locale } from '../../types';

function Locale({ children }: { children: React.ReactNode }) {
    const defaultGeorgian = /^(ka|ka-GE)$/.test(navigator.language);

    const [locale, setLocale] = useLocalStorageState(
        localeKey,
        defaultGeorgian ? 'KA' : 'ENG'
    );

    const changeLocale = (locale: Locale) => setLocale(locale);

    return (
        <LocaleContext.Provider value={{ locale, changeLocale }}>
            {children}
        </LocaleContext.Provider>
    );
}

export default Locale;
