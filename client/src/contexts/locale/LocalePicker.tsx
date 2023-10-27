import { useLocaleContext } from '.';
import { Form } from 'react-bootstrap';
import { Locale } from '../../types';

export default function LocalePicker() {
    const { locale, changeLocale } = useLocaleContext();

    const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        changeLocale(e.target.value as Locale);
    };

    return (
        <Form.Select
            value={locale}
            onChange={handleLocaleChange}
            aria-label='Choose locale'
        >
            <option value={'ENG'}>English</option>
            <option value={'KA'}>ქართული</option>
        </Form.Select>
    );
}
