import { useLocale } from '../../contexts/locale';
import { Table } from 'react-bootstrap';
import { SortAsc, SortDesc } from 'lucide-react';
import styles from './collectionPageStyles.module.scss';

type ItemTableProps = {
    children: React.ReactNode;
    allowEdit: boolean;
    extraHeadings?: string[];
    totalFieldsNumber?: number;
    sortAscending: boolean;
    sortKey: string;
    handleSorting: (key: string) => () => void;
};

function ItemTable({
    children,
    allowEdit,
    extraHeadings,
    totalFieldsNumber = 0,
    sortAscending,
    sortKey,
    handleSorting,
}: ItemTableProps) {
    const t = useLocale('collectionPage');
    return (
        <Table responsive hover className={`${styles.table} mt-5 mb-5`}>
            <thead>
                <tr>
                    <th onClick={handleSorting('name')}>
                        {t('name')}
                        {sortKey === 'name' ? (
                            sortAscending ? (
                                <SortAsc />
                            ) : (
                                <SortDesc />
                            )
                        ) : (
                            <SortAsc />
                        )}
                    </th>
                    <th>{t('tags')}</th>
                    {extraHeadings?.map((heading, ind) => (
                        <th onClick={handleSorting(heading)} key={ind}>
                            {heading +
                                (ind === extraHeadings.length - 1 &&
                                totalFieldsNumber > ind + 1
                                    ? '...'
                                    : '')}
                            {sortKey === heading ? (
                                sortAscending ? (
                                    <SortAsc />
                                ) : (
                                    <SortDesc />
                                )
                            ) : (
                                <SortAsc />
                            )}
                        </th>
                    ))}
                    {allowEdit && <th>{t('delete')}</th>}
                    <th className='text-center'>{t('link')}</th>
                </tr>
            </thead>
            <tbody>{children}</tbody>
        </Table>
    );
}

export default ItemTable;
