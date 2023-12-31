import { LocaleContext } from './localeContext';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import { localeKey } from '../../data/localStorageKeys';
import type { Locale as LocaleType } from '../../types';

export default function Locale({ children }: { children: React.ReactNode }) {
    const defaultRu = /^(ru|ru-RU)$/.test(navigator.language);
    const defaultKe = /^(ka|ke-GE)$/.test(navigator.language);

    const [locale, setLocale] = useLocalStorageState(
        localeKey,
        defaultRu ? 'ru' : defaultKe ? 'ge' : 'en'
    );

    const changeLocale = (locale: LocaleType) => setLocale(locale);

    return (
        <LocaleContext.Provider value={{ locale, changeLocale }}>
            {children}
        </LocaleContext.Provider>
    );
}
