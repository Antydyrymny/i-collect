import { Outlet, useParams } from 'react-router-dom';
import { useGetCollectionQuery } from '../../../app/services/api';
import { useInformOfError } from '../../../hooks';
import { MainSpinner } from '../../../components';

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
            {collectionOptions.isFetching && <MainSpinner />}
            {collectionOptions.isSuccess && <Outlet context={collection} />}
        </>
    );
}

export default CollectionLayout;
