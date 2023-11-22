import { Table } from 'react-bootstrap';
import { ClientRoutes, ItemResponse } from '../../types';
import styles from '../collection/collectionPageStyles.module.scss';
import { TooltipOverlay } from '../../components';
import { Link } from 'react-router-dom';
import { useLocale } from '../../contexts/locale';

type LatestItemsProps = {
    items: ItemResponse[];
};

function LatestItems({ items }: LatestItemsProps) {
    const t = useLocale('home');

    return (
        <Table hover className={`${styles.table} my-1`}>
            <thead>
                <tr>
                    <th>{t('itemName')}</th>
                    <th>{t('ofCollection')}</th>
                    <th>{t('tags')}</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item) => (
                    <tr key={item._id}>
                        <td>
                            <TooltipOverlay
                                id={'itemName'}
                                tooltipMessage={t('toItem') + item.name}
                            >
                                <Link
                                    to={ClientRoutes.ItemPath + item._id}
                                    className='d-block'
                                >
                                    {item.name}
                                </Link>
                            </TooltipOverlay>
                        </td>
                        <td>
                            <TooltipOverlay
                                id={'collectionAuthor'}
                                tooltipMessage={t('toItem') + item.name}
                            >
                                <Link
                                    to={ClientRoutes.ItemPath + item._id}
                                    className='d-block'
                                >
                                    {item.parentCollection.name}
                                </Link>
                            </TooltipOverlay>
                        </td>
                        <td>
                            <TooltipOverlay
                                id={'collectionItemsNumber'}
                                tooltipMessage={t('toItem') + item.name}
                            >
                                <Link
                                    to={ClientRoutes.ItemPath + item._id}
                                    className='d-block'
                                >
                                    {item.tags.slice(0, 3).map((tag, ind) => (
                                        <span
                                            key={ind}
                                            className='badge border border-primary text-primary rounded-5 me-1'
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {!item.tags.length && '-'}
                                    {item.tags.length > 3 ? '...' : ''}
                                </Link>
                            </TooltipOverlay>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default LatestItems;
