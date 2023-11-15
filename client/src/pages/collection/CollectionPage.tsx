import { useMemo } from 'react';
import { Spinner, Stack } from 'react-bootstrap';
import { useGetCollectionQuery } from '../../app/services/api';
import { useParams } from 'react-router-dom';
import { useSelectUser } from '../../app/services/features/auth';
import Collection from './Collection';
import Items from './Items';
import { useInformOfError } from '../../hooks';

function CollectionPage() {
    const { collectionId } = useParams();

    const { data: collection, ...collectionOptions } = useGetCollectionQuery(
        collectionId!,
        {
            skip: !collectionId,
        }
    );
    useInformOfError({
        isError: collectionOptions.isError,
        error: collectionOptions.error,
    });

    const user = useSelectUser();
    const allowEdit = user.admin || user._id === collection?.authorId;

    const formatFields = useMemo(() => collection?.format, [collection?.format]);

    return (
        <>
            {collectionOptions.isFetching && (
                <Stack
                    className='d-flex justify-content-center align-items-center'
                    style={{ minHeight: 'calc(100vh - 8.5rem)' }}
                >
                    <Spinner />
                </Stack>
            )}
            {collectionOptions.isSuccess && (
                <Collection collection={collection!} allowEdit={allowEdit} />
            )}
            {collectionOptions.isSuccess && (
                <Items
                    collectionId={collection!._id}
                    allowEdit={allowEdit}
                    itemsNumber={collection!.itemNumber}
                    collectionFieldsNumber={collection!.format.length}
                    formatFields={formatFields!}
                />
            )}
        </>
    );
}

export default CollectionPage;
