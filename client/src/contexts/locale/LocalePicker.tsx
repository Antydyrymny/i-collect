import { useLocaleContext } from '.';
import { Form, Image } from 'react-bootstrap';
import { Locale } from '../../types';
import { useThemeContext } from '../theme';
import globe from '../../assets/globe.png';
import globeDark from '../../assets/dark-dark.png';
import styles from './localePickerStyles.module.scss';

export default function LocalePicker() {
    const { locale, changeLocale } = useLocaleContext();
    const { theme } = useThemeContext();

    const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        changeLocale(e.target.value as Locale);
    };

    return (
        <div className='d-flex justify-content-center align-items-center '>
            {theme === 'light' && <Image src={globe} />}
            {theme === 'dark' && <Image src={globeDark} />}
            <Form.Select
                className={`${styles.select} border-0 outline-0`}
                value={locale}
                onChange={handleLocaleChange}
                aria-label='Choose locale'
            >
                <option value={'ENG'}>English</option>
                <option value={'KA'}>ქართული</option>
            </Form.Select>
        </div>
    );
}
