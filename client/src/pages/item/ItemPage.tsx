import { useParams } from 'react-router-dom';
import { useGetItemQuery, useSubscribeToItemUpdatesQuery } from '../../app/services/api';
import { useSelectUser } from '../../app/services/features/auth';
import { useInformOfError } from '../../hooks';
import { MainSpinner } from '../../components';
import ItemCard from './ItemCard';
import Comments from './Comments';

function ItemPage() {
    const user = useSelectUser();
    const { itemId } = useParams();

    const { data: item, ...itemOptions } = useGetItemQuery(
        { _id: itemId!, userId: user._id ?? undefined },
        {
            skip: !itemId,
        }
    );
    const { ...itemSubscription } = useSubscribeToItemUpdatesQuery(itemId!, {
        skip: !itemId,
    });

    const allowEdit = user.admin || (!!user._id && user._id === item?.authorId);

    useInformOfError([
        { isError: itemOptions.isError, error: itemOptions.error },
        { isError: itemSubscription.isError, error: itemSubscription.error },
    ]);

    return (
        <>
            {itemOptions.isFetching && <MainSpinner />}
            {itemOptions.isSuccess && (
                <>
                    <ItemCard item={item!} allowEdit={allowEdit} />
                    <Comments itemId={itemId} />
                </>
            )}
        </>
    );
}

export default ItemPage;
