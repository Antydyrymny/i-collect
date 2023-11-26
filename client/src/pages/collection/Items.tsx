import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    useGetCollectionItemsQuery,
    useLazyFindCollectionItemsQuery,
} from '../../app/services/api';
import { useLocale } from '../../contexts/locale';
import { Button, Col, Row, Spinner, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { SearchBar } from '../../components';
import ItemPreviewRow from './ItemPreviewRow';
import {
    useInfiniteScrollLoading,
    useInformOfError,
    useItemSorting,
    useSearchUtils,
} from '../../hooks';
import { getItemPreviewHeadings } from './getItemPreviewHeadings';
import { ClientRoutes, FormatField } from '../../types';
import ItemTable from './ItemTable';

type ItemsProps = {
    collectionId: string;
    allowEdit: boolean;
    itemsNumber: number;
    collectionFieldsNumber: number;
    formatFields: FormatField[];
};

function Items({
    collectionId,
    allowEdit,
    itemsNumber,
    collectionFieldsNumber,
    formatFields,
}: ItemsProps) {
    const { searchQuery, handleSearchChange, clearSearch } = useSearchUtils();
    const [search, { data: searchResults, ...searchOptions }] =
        useLazyFindCollectionItemsQuery();

    const [searching, setSearching] = useState(false);
    useEffect(() => {
        setSearching(false);
    }, [searchQuery]);

    const submitSearch = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!searchQuery) return;
            search({ query: searchQuery, collectionId });
            setSearching(true);
        },
        [collectionId, search, searchQuery]
    );

    const [page, setPage] = useState(0);
    const { data: itemsData, ...itemsOptions } = useGetCollectionItemsQuery({
        collectionId,
        page,
    });
    const pageBottomRef = useRef<HTMLSpanElement>(null);
    useInfiniteScrollLoading(
        pageBottomRef,
        () => setPage((page) => page + 1),
        itemsOptions.isFetching ||
            searchOptions.isLoading ||
            !!(searchQuery && searchResults),
        itemsData?.moreToFetch ?? true
    );

    useInformOfError([
        { isError: itemsOptions.isError, error: itemsOptions.error },
        { isError: searchOptions.isError, error: searchOptions.error },
    ]);

    const additionalHeadings = useMemo(
        () => getItemPreviewHeadings(formatFields),
        [formatFields]
    );

    useEffect(() => {
        setPage(1);
    }, [formatFields]);

    const itemsToDisplay = useMemo(
        () =>
            searching && searchOptions.isSuccess
                ? searchResults!
                : itemsOptions.isSuccess
                ? itemsData!.items!
                : [],
        [
            itemsData,
            itemsOptions.isSuccess,
            searchOptions.isSuccess,
            searchResults,
            searching,
        ]
    );

    const { sortAscending, sortKey, sortedItems, handleSorting } =
        useItemSorting(itemsToDisplay);

    const t = useLocale('collectionPage');

    return (
        <>
            <Row className='mt-5'>
                <Col>
                    <h5>
                        {t('totalItems')}
                        {itemsNumber}
                    </h5>
                </Col>
                <Col>
                    <SearchBar
                        searchQuery={searchQuery}
                        handleSearchChange={handleSearchChange}
                        clearSearch={clearSearch}
                        submitSearch={submitSearch}
                        label={t('searchLabel')}
                        placeholder={t('searchPlaceholder')}
                    />
                </Col>
            </Row>
            {allowEdit && (
                <Link to={ClientRoutes.NewItem} className='px-0'>
                    <Button>{t('newItem')}</Button>
                </Link>
            )}
            {(!!searchResults?.length || !!itemsData?.items.length) && (
                <ItemTable
                    allowEdit={allowEdit}
                    extraHeadings={additionalHeadings}
                    totalFieldsNumber={collectionFieldsNumber}
                    sortKey={sortKey}
                    sortAscending={sortAscending}
                    handleSorting={handleSorting}
                >
                    {sortedItems.map((item) => (
                        <ItemPreviewRow
                            key={item._id}
                            item={item}
                            allowEdit={allowEdit}
                            collectionId={collectionId}
                        />
                    ))}
                </ItemTable>
            )}
            {!searchResults?.length && !itemsData?.items.length && (
                <Stack className='mt-5 text-center'>
                    <h6>{t('noItems')}</h6>
                </Stack>
            )}
            {(itemsOptions.isFetching || searchOptions.isFetching) && (
                <Stack className='mb-5 d-flex justify-content-center align-items-center'>
                    <Spinner />
                </Stack>
            )}
            <span ref={pageBottomRef} />
        </>
    );
}

export default Items;
