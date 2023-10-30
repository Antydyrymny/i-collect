import { useState, useMemo } from 'react';
import { Table, FormCheck } from 'react-bootstrap';
import { useLocale } from '../../contexts/locale';
import { UserPreview } from '../../types';
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
            className={`table-bordered ${!allowChanges ? 'opacity-75' : null}`}
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
                        <img
                            src={dropDown}
                            className={`${!sorted ? styles.sortUp : null}`}
                        />
                    </th>
                    <th>{t('email')}</th>
                    <th>{t('adminRights')}</th>
                    <th>{t('login')}</th>
                    <th>{t('status')}</th>
                </tr>
            </thead>
            <tbody>
                {/* {sortedUsers.map((user) => (
                    <UserRow
                        key={user._id}
                        user={user}
                        selected={selected}
                        handleSelectOne={handleSelectOne}
                    />
                ))} */}
            </tbody>
        </Table>
    );
}

export default UserTable;
