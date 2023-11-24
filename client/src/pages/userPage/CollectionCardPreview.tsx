import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../contexts/locale';
import { Button, Card, Image } from 'react-bootstrap';
import { ClientRoutes, CollectionPreview } from '../../types';
import { useDeleteCollectionMutation } from '../../app/services/api';
import { DeleteButton } from '../../components';

type CollectionPreviewProps = {
    collection: CollectionPreview;
    userId: string | undefined;
};
const CollectionCardPreview = memo(function CollectionCardPreview({
    collection,
    userId,
}: CollectionPreviewProps) {
    const t = useLocale('userPage');

    const [deleteCollection, deleteOptions] = useDeleteCollectionMutation();
    const handleDelete = () => {
        if (deleteOptions.isLoading) return;
        deleteCollection({ collectionToDeleteId: collection._id, userId });
    };

    const parser = new DOMParser();
    const parsedString = parser.parseFromString(collection.description, 'text/html');
    const pureStringDescription = parsedString.body.textContent || '';

    return (
        <Card className='mt-4'>
            <div className='position-absolute top-0 mt-3 end-0 me-2'>
                <div className='me-lg-3'>
                    <DeleteButton
                        handleDelete={handleDelete}
                        disabled={deleteOptions.isLoading}
                        isLoading={deleteOptions.isLoading}
                        tooltipMsg={t('delete')}
                        outline
                    />
                </div>
            </div>
            <Card.Body>
                <Card.Title>{collection.name}</Card.Title>
                <Card.Subtitle className='mb-1'>
                    <span>{t('theme') + collection.theme}</span>
                </Card.Subtitle>
                <hr />

                {collection.image && (
                    <Image
                        className='me-3 border border-secondary-1 rounded-3 object-fit-contain'
                        style={{ width: '320px', height: '180px', float: 'left' }}
                        src={collection.image}
                    />
                )}
                <Card.Text>{pureStringDescription}</Card.Text>

                <Card.Text className='d-flex justify-content-end mb-1'>
                    {t('totalItems') + collection.itemNumber}
                </Card.Text>
                <Card.Text className='d-flex justify-content-end'>
                    <Link to={ClientRoutes.CollectionPath + collection._id}>
                        <Button variant='outline-primary'>{t('toCollection')}</Button>
                    </Link>
                </Card.Text>
            </Card.Body>
        </Card>
    );
});

export default CollectionCardPreview;
