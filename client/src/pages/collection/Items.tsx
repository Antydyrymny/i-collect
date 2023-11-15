import { memo, useRef, useState } from 'react';
import { useGetCollectionItemsQuery } from '../../app/services/api';
import useInfiniteScrollLoading from '../../hooks/useInfiniteScrollLoading';
import { Button, Spinner, Stack, Table } from 'react-bootstrap';
import styles from './collectionPageStyles.module.scss';
import ItemPreviewRow from './ItemPreviewRow';
import { useInformOfError } from '../../hooks';
import { Link } from 'react-router-dom';
import { ClientRoutes } from '../../types';

type ItemsProps = {
    collectionId: string;
    allowEdit: boolean;
    itemsNumber: number;
    collectionFieldsNumber: number;
};

const Items = memo(function Items({
    collectionId,
    allowEdit,
    itemsNumber,
    collectionFieldsNumber,
}: ItemsProps) {
    const [page, setPage] = useState(0);
    const { data: itemsData, ...itemsOptions } = useGetCollectionItemsQuery({
        collectionId,
        page,
    });
    const pageBottomRef = useRef<HTMLSpanElement>(null);
    useInfiniteScrollLoading(
        pageBottomRef,
        () => setPage((page) => page + 1),
        itemsOptions.isFetching,
        itemsData?.moreToFetch ?? true
    );

    useInformOfError({ isError: itemsOptions.isError, error: itemsOptions.error });

    return (
        <>
            <h5 className='mt-5 mb-3'>Total items: {itemsNumber}</h5>
            {allowEdit && (
                <Link to={ClientRoutes.NewCollection} className='px-0'>
                    <Button>{'Create new item'}</Button>
                </Link>
            )}
            <Table responsive className={`${styles.table} mb-5 mt-4`}>
                {itemsOptions.isSuccess && !!itemsData?.items?.length && (
                    <>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Tags</th>
                                {itemsData?.items[0].fields.map((fieldName, ind) => (
                                    <th key={ind}>
                                        {Object.keys(fieldName)[0] +
                                            (ind ===
                                                itemsData.items[0].fields.length - 1 &&
                                            collectionFieldsNumber > ind + 1
                                                ? '...'
                                                : '')}
                                    </th>
                                ))}
                                {allowEdit && <th>Delete</th>}
                                <th className='text-center'>Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemsData.items.map((item) => (
                                <ItemPreviewRow
                                    key={item._id}
                                    item={item}
                                    allowEdit={allowEdit}
                                    collectionId={collectionId}
                                />
                            ))}
                        </tbody>
                    </>
                )}
            </Table>
            {itemsOptions.isFetching && (
                <Stack className='mt-5 d-flex justify-content-center align-items-center'>
                    <Spinner />
                </Stack>
            )}
            <span ref={pageBottomRef} />
        </>
    );
});

export default Items;
