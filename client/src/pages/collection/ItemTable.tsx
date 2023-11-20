import { memo } from 'react';
import { useLocale } from '../../contexts/locale';
import { Table } from 'react-bootstrap';
import styles from './collectionPageStyles.module.scss';

type ItemTableProps = {
    children: React.ReactNode;
    allowEdit: boolean;
    extraHeadings?: string[];
    totalFieldsNumber?: number;
};

const ItemTable = memo(function ItemTable({
    children,
    allowEdit,
    extraHeadings,
    totalFieldsNumber = 0,
}: ItemTableProps) {
    const t = useLocale('collectionPage');

    return (
        <Table responsive className={`${styles.table} mt-5 mb-5`}>
            <thead>
                <tr>
                    <th>{t('name')}</th>
                    <th>{t('tags')}</th>
                    {extraHeadings?.map((heading, ind) => (
                        <th key={ind}>
                            {heading +
                                (ind === extraHeadings.length - 1 &&
                                totalFieldsNumber > ind + 1
                                    ? '...'
                                    : '')}
                        </th>
                    ))}
                    {allowEdit && <th>{t('delete')}</th>}
                    <th className='text-center'>{t('link')}</th>
                </tr>
            </thead>
            <tbody>{children}</tbody>
        </Table>
    );
});

export default ItemTable;
