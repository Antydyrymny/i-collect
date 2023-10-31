import { useState, useMemo } from 'react';
import { Table, FormCheck, Image } from 'react-bootstrap';
import { useLocale } from '../../contexts/locale';
import { useThemeContext } from '../../contexts/theme';
import { UserPreview } from '../../types';
import UserRow from './UserRow';
import sort from '../../assets/sort.png';
import sordDark from '../../assets/sort-dark.png';
import styles from './usersStyles.module.scss';

type UserTableProps = {
    users: UserPreview[];
    selected: string[];
    handleSelectOne: (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    allowChanges: boolean;
};
function UserTable({
    users,
    selected,
    handleSelectOne,
    handleSelectAll,
    allowChanges,
}: UserTableProps) {
    const t = useLocale('manageUsers');
    const { theme } = useThemeContext();

    const [sorted, setSorted] = useState(true);
    const sortedUsers = useMemo(
        () =>
            users
                .slice()
                .sort((a, b) =>
                    sorted ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
                ),
        [users, sorted]
    );

    return (
        <Table
            className={`${styles.table} table-bordered mb-4 mt-2 ${
                !allowChanges ? 'opacity-75' : null
            }`}
            responsive
        >
            <thead>
                <tr>
                    <th style={{ textAlign: 'center' }}>
                        <FormCheck aria-label='check/uncheck all'>
                            <FormCheck.Input
                                className={styles.checkbox}
                                checked={selected.length === sortedUsers.length}
                                onChange={handleSelectAll}
                            />
                        </FormCheck>
                    </th>
                    <th onClick={() => setSorted(!sorted)} className={styles.sort}>
                        {t('name')}
                        <Image
                            src={theme === 'light' ? sort : sordDark}
                            className={`${!sorted ? styles.sortUp : null}`}
                        />
                    </th>
                    <th>{t('adminRights')}</th>
                    <th>{t('lastLogin')}</th>
                    <th>{t('status')}</th>
                    <th>{t('collections')}</th>
                </tr>
            </thead>
            <tbody>
                {sortedUsers.map((user) => (
                    <UserRow
                        key={user._id}
                        user={user}
                        selected={selected}
                        handleSelectOne={handleSelectOne}
                    />
                ))}
            </tbody>
        </Table>
    );
}

export default UserTable;
