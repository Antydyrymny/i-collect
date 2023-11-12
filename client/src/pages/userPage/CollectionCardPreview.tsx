import { Link } from 'react-router-dom';
import { useLocale } from '../../contexts/locale';
import { useThemeContext } from '../../contexts/theme';
import { Button, Card, Image, Spinner } from 'react-bootstrap';
import TooltipOverlay from '../../components/tooltip/TooltipOverlay';
import trash from '../../assets/deleteUser.png';
import trashDark from '../../assets/deleteUser-dark.png';
import { ClientRoutes, CollectionPreview } from '../../types';
import { useDeleteCollectionMutation } from '../../app/services/api';

type CollectionPreviewProps = {
    collection: CollectionPreview;
    ownerId: string | undefined;
};
function CollectionCardPreview({ collection, ownerId }: CollectionPreviewProps) {
    const t = useLocale('userPage');
    const { theme } = useThemeContext();

    const [deleteCollection, deleteOptions] = useDeleteCollectionMutation();
    const handleDelete = () => {
        deleteCollection({ _id: collection._id, ownerId });
    };

    return (
        <Card className='mt-4'>
            <div className='position-absolute top-0 mt-3 end-0 me-2'>
                <TooltipOverlay id='delete' tooltipMessage={t('delete')}>
                    <Button
                        disabled={deleteOptions.isLoading}
                        onClick={handleDelete}
                        variant='outline-danger'
                        className='me-lg-3 d-flex justify-content-center align-items-center gap-1'
                    >
                        {deleteOptions.isLoading ? (
                            <Spinner size='sm' />
                        ) : (
                            <Image src={theme === 'light' ? trash : trashDark} />
                        )}
                    </Button>
                </TooltipOverlay>
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
