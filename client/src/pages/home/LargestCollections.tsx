import { Table } from 'react-bootstrap';
import { ClientRoutes, CollectionPreview } from '../../types';
import styles from '../collection/collectionPageStyles.module.scss';
import { TooltipOverlay } from '../../components';
import { Link } from 'react-router-dom';
import { useLocale } from '../../contexts/locale';

type LargestCollectionsProps = {
    collections: CollectionPreview[];
};

function LargestCollections({ collections }: LargestCollectionsProps) {
    const t = useLocale('home');

    return (
        <Table hover className={`${styles.table} my-1`}>
            <thead>
                <tr>
                    <th>{t('collectionName')}</th>
                    <th>{t('author')}</th>
                    <th>{t('itemNumber')}</th>
                </tr>
            </thead>
            <tbody>
                {collections.map((collection) => (
                    <tr key={collection._id}>
                        <td>
                            <TooltipOverlay
                                id={'collectionName'}
                                tooltipMessage={t('toCollection') + collection.name}
                            >
                                <Link
                                    to={ClientRoutes.CollectionPath + collection._id}
                                    className='d-block'
                                >
                                    {collection.name}
                                </Link>
                            </TooltipOverlay>
                        </td>
                        <td>
                            <TooltipOverlay
                                id={'collectionAuthor'}
                                tooltipMessage={t('toCollection') + collection.name}
                            >
                                <Link
                                    to={ClientRoutes.CollectionPath + collection._id}
                                    className='d-block'
                                >
                                    {collection.authorName}
                                </Link>
                            </TooltipOverlay>
                        </td>
                        <td>
                            <TooltipOverlay
                                id={'collectionItemsNumber'}
                                tooltipMessage={t('toCollection') + collection.name}
                            >
                                <Link
                                    to={ClientRoutes.CollectionPath + collection._id}
                                    className='d-block'
                                >
                                    {collection.itemNumber}
                                </Link>
                            </TooltipOverlay>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default LargestCollections;
