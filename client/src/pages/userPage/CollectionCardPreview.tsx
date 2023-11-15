import { Link } from 'react-router-dom';
import { useLocale } from '../../contexts/locale';
import { Button, Card } from 'react-bootstrap';
import { ClientRoutes, CollectionPreview } from '../../types';
import { useDeleteCollectionMutation } from '../../app/services/api';
import { DeleteButton } from '../../components';

type CollectionPreviewProps = {
    collection: CollectionPreview;
};
function CollectionCardPreview({ collection }: CollectionPreviewProps) {
    const t = useLocale('userPage');

    const [deleteCollection, deleteOptions] = useDeleteCollectionMutation();
    const handleDelete = () => {
        deleteCollection(collection._id);
    };

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
                {collection.image && <Card.Img variant='top' src={collection.image} />}
                <Card.Title>{collection.name}</Card.Title>
                <Card.Subtitle className='mb-1'>
                    <span>{t('theme') + collection.theme}</span>
                </Card.Subtitle>
                <hr />
                <Card.Text>{collection.description}</Card.Text>
                <Card.Text className='d-flex justify-content-end mb-1'>
                    {t('totalItems') + collection.itemNumber}
                </Card.Text>
                <Card.Text className='d-flex justify-content-end'>
                    <Link to={ClientRoutes.CollectionPath + collection._id}>
                        <Button size='sm'>{t('toCollection')}</Button>
                    </Link>
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default CollectionCardPreview;
