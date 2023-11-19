import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useCallback } from 'react';
import { useLocale } from '../contexts/locale';

dayjs.extend(relativeTime);

/**
 * Get a string representation of time passed since passed timestamp
 * @param timestamp
 * @returns
 * @timeAgo string in current locale
 */
export const useTimeAgo = (timestamp: Date): string => {
    const t = useLocale('time');

    const getTimeAgo = useCallback(() => {
        const now = dayjs();
        const targetTime = dayjs(timestamp);

        const diffInMinutes = now.diff(targetTime, 'minute');
        if (diffInMinutes < 1) {
            return t('lessM');
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} ${
                diffInMinutes === 1 ? t('m') : diffInMinutes < 5 ? t('ms') : t('mss')
            } ${t('ago')}`;
        } else if (diffInMinutes < 1440) {
            const diffInHours = now.diff(targetTime, 'hour');
            return `${diffInHours} ${
                diffInHours === 1 ? t('h') : diffInHours < 5 ? t('hs') : t('hss')
            } ${t('ago')}`;
        } else {
            const diffInDays = now.diff(targetTime, 'day');
            return `${diffInDays} ${
                diffInDays === 1 ? t('d') : diffInDays < 5 ? t('ds') : t('dss')
            } ${t('ago')}`;
        }
    }, [t, timestamp]);

    return getTimeAgo();
};
