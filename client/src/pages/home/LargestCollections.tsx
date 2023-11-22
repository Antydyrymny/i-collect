import { Table } from 'react-bootstrap';
import { CollectionPreview } from '../../types';
import styles from '../collection/collectionPageStyles.module.scss';

type LargestCollectionsProps = {
    collections: CollectionPreview[];
};

function LargestCollections({ collections }: LargestCollectionsProps) {
    return (
        <Table responsive hover className={`${styles.table} my-1`}>
            <tbody>
                {collections.map((collection) => (
                    <tr key={collection._id}>
                        <td>{collection.name}</td>
                        <td>by {collection.authorName}</td>
                        <td>items: {collection.itemNumber}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default LargestCollections;
