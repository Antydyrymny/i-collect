import { memo } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useThemeContext } from '../../contexts/theme';
import { useLocale } from '../../contexts/locale';
import { useSelectUser } from '../../app/services/features/auth';
import { FormCheck, Image, Button } from 'react-bootstrap';
import block from '../../assets/block.png';
import blockDark from '../../assets/block-dark.png';
import { ClientRoutes, type UserPreview } from '../../types';
import styles from './usersStyles.module.scss';

type UserRowProps = {
    user: UserPreview;
    selected: boolean;
    handleSelectOne: (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const UserRow = memo(function UserRow({ user, selected, handleSelectOne }: UserRowProps) {
    const t = useLocale('manageUsers');
    const { theme } = useThemeContext();
    const adminState = useSelectUser();

    return (
        <tr
            className={`${selected ? 'table-active ' : ''} ${
                adminState._id === user._id ? 'border-primary border-2' : ''
            }`}
        >
            <td className='text-center'>
                <FormCheck aria-label='check/uncheck all'>
                    <FormCheck.Input
                        checked={selected}
                        onChange={handleSelectOne(user._id)}
                    />
                </FormCheck>
            </td>
            <td> {user.name}</td>
            <td>{user.admin ? t('adminTrue') : t('adminFalse')}</td>
            <td>{dayjs(user.lastLogin).format('HH:mm:ss, D MMM, YYYY')}</td>
            <td>
                <div className='d-flex justify-content-around align-items-center'>
                    {user.status}
                    {user.status === 'online' ? (
                        <div className={styles.online} />
                    ) : user.status === 'offline' ? (
                        <div className={styles.offline} />
                    ) : (
                        <Image src={theme === 'light' ? block : blockDark} />
                    )}
                </div>
            </td>
            <td className='d-flex justify-content-center'>
                <Button>
                    <Link to={ClientRoutes.UserPagePath + user._id}>
                        {t('toCollections')}
                    </Link>
                </Button>
            </td>
        </tr>
    );
});

export default UserRow;
