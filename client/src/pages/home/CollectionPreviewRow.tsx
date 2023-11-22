import { Link } from 'react-router-dom';
import { ClientRoutes, CollectionPreview } from '../../types';
import { Button } from 'react-bootstrap';

type CollectionPreviewProps = {
    collection: CollectionPreview;
};

function CollectionPreviewRow({ collection }: CollectionPreviewProps) {
    return (
        <tr>
            <td>Collection</td>
            <td>{collection.name}</td>
            <td>{collection.theme}</td>
            <td className='text-center'>
                <Link
                    to={ClientRoutes.CollectionPath + collection._id}
                    className='text-nowrap'
                >
                    <Button
                        size='sm'
                        variant='outline-primary'
                        style={{ minWidth: '6rem' }}
                    >
                        {'To collection'}
                    </Button>
                </Link>
            </td>
        </tr>
    );
}

export default CollectionPreviewRow;
