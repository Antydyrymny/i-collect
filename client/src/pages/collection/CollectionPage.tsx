import { useMemo } from 'react';
import { useSelectUser } from '../../app/services/features/auth';
import CollectionCard from './CollectionCard';
import Items from './Items';
import { useCollection } from '../layouts/collectionLayout/useCollection';

function CollectionPage() {
    const collection = useCollection();

    const user = useSelectUser();
    const allowEdit = user.admin || (!!user._id && user._id === collection?.authorId);

    const formatFields = useMemo(() => collection?.format, [collection?.format]);

    return (
        <>
            <CollectionCard collection={collection!} allowEdit={allowEdit} />
            <Items
                collectionId={collection!._id}
                allowEdit={allowEdit}
                itemsNumber={collection!.itemNumber}
                collectionFieldsNumber={collection!.format.length}
                formatFields={formatFields!}
            />
        </>
    );
}

export default CollectionPage;
