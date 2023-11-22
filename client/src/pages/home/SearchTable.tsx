import styles from '../collection/collectionPageStyles.module.scss';
import { Table } from 'react-bootstrap';

type SearchTableProps = {
    children: React.ReactNode;
};

function SearchTable({ children }: SearchTableProps) {
    return (
        <Table responsive hover className={`${styles.table} mt-5 mb-5`}>
            <thead>
                <tr>
                    <th>{'Type'}</th>
                    <th>{'Name'}</th>
                    <th>{'Theme/Tags'}</th>
                    <th className='text-center'>{'Link'}</th>
                </tr>
            </thead>
            <tbody>{children}</tbody>
        </Table>
    );
}

export default SearchTable;
