import { useLocaleContext } from '.';
import en from './translations/en.json';
import ru from './translations/ru.json';

const translations = { en, ru };
type Translation = typeof en | typeof ru;

export const useLocale = <TComponent extends keyof Translation>(
    componentName: TComponent
) => {
    const { locale } = useLocaleContext();

    return <TField extends keyof Translation[TComponent]>(field: TField) =>
        translations[locale][componentName][field];
};
