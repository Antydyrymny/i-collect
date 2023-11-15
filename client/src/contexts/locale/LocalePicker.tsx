import { useLocaleContext } from '.';
import { Form, Image } from 'react-bootstrap';
import { nanoid } from '@reduxjs/toolkit';
import { useThemeContext } from '../theme';
import globe from '../../assets/globe.png';
import globeDark from '../../assets/globe-dark.png';
import { Locale } from '../../types';
import styles from './localePickerStyles.module.scss';

export default function LocalePicker() {
    const { locale, changeLocale } = useLocaleContext();
    const { theme } = useThemeContext();

    const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        changeLocale(e.target.value as Locale);
    };

    return (
        <Form.Group
            controlId={'locale' + nanoid()}
            className='d-flex justify-content-center align-items-center '
        >
            <Form.Label className='m-0'>
                {theme === 'light' && <Image src={globe} />}
                {theme === 'dark' && <Image src={globeDark} />}
            </Form.Label>
            <Form.Select
                className={`${styles.select} border-0 outline-0`}
                value={locale}
                onChange={handleLocaleChange}
                aria-label='Choose locale'
            >
                <option value={'en'} className={`bg-${theme}`}>
                    English
                </option>
                <option value={'ru'} className={`bg-${theme}`}>
                    Русский
                </option>
            </Form.Select>
        </Form.Group>
    );
}
