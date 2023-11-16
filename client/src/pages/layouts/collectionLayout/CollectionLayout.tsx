import { Outlet, useParams } from 'react-router-dom';
import { useGetCollectionQuery } from '../../../app/services/api';
import { useInformOfError } from '../../../hooks';
import { Spinner, Stack } from 'react-bootstrap';

function CollectionLayout() {
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
            {collectionOptions.isSuccess && <Outlet context={collection} />}
        </>
    );
}

export default CollectionLayout;
