import { useLocaleContext } from '.';
import en from '../../data/translations/en.json';
import ru from '../../data/translations/ru.json';
import ge from '../../data/translations/ge.json';

const translations = { en, ru, ge };
type Translation = typeof en | typeof ru;

export const useLocale = <TComponent extends keyof Translation>(
    componentName: TComponent
) => {
    const { locale } = useLocaleContext();

    return <TField extends keyof Translation[TComponent]>(field: TField) =>
        translations[locale][componentName][field];
};
