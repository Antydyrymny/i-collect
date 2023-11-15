import { memo, useCallback, useRef, useState } from 'react';
import {
    useGetCollectionItemsQuery,
    useLazyFindCollectionItemsQuery,
} from '../../app/services/api';
import { Button, Col, Row, Spinner, Stack, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { SearchBar } from '../../components';
import ItemPreviewRow from './ItemPreviewRow';
import { useInfiniteScrollLoading, useInformOfError, useSearchUtils } from '../../hooks';
import { getItemPreviewHeadings } from './getItemPreviewHeadings';
import { ClientRoutes, FormatField } from '../../types';
import styles from './collectionPageStyles.module.scss';
import { useLocale } from '../../contexts/locale';

type ItemsProps = {
    collectionId: string;
    allowEdit: boolean;
    itemsNumber: number;
    collectionFieldsNumber: number;
    formatFields: FormatField[];
};

const Items = memo(function Items({
    collectionId,
    allowEdit,
    itemsNumber,
    collectionFieldsNumber,
    formatFields,
}: ItemsProps) {
    const { searchQuery, handleSearchChange, clearSearch } = useSearchUtils();
    const [search, { data: searchResults, ...searchOptions }] =
        useLazyFindCollectionItemsQuery();
    const submitSearch = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!searchQuery) return;
            search({ query: searchQuery, collectionId });
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

    const additionalHeadings = getItemPreviewHeadings(formatFields);

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
            <Table responsive className={`${styles.table} mt-5 mb-5`}>
                <thead>
                    <tr>
                        <th>{t('name')}</th>
                        <th>{t('tags')}</th>
                        {additionalHeadings.map((heading, ind) => (
                            <th key={ind}>
                                {heading +
                                    (ind === additionalHeadings.length - 1 &&
                                    collectionFieldsNumber > ind + 1
                                        ? '...'
                                        : '')}
                            </th>
                        ))}
                        {allowEdit && <th>{t('delete')}</th>}
                        <th className='text-center'>{t('link')}</th>
                    </tr>
                </thead>
                <tbody>
                    {searchQuery &&
                        searchOptions.isSuccess &&
                        searchOptions.originalArgs?.query === searchQuery &&
                        searchResults?.map((foundItem) => (
                            <ItemPreviewRow
                                key={foundItem._id}
                                item={foundItem}
                                allowEdit={allowEdit}
                                collectionId={collectionId}
                            />
                        ))}
                    {!(searchQuery && searchResults) &&
                        itemsOptions.isSuccess &&
                        itemsData?.items.map((item) => (
                            <ItemPreviewRow
                                key={item._id}
                                item={item}
                                allowEdit={allowEdit}
                                collectionId={collectionId}
                            />
                        ))}
                </tbody>
            </Table>
            {(itemsOptions.isFetching || searchOptions.isFetching) && (
                <Stack className='mb-5 d-flex justify-content-center align-items-center'>
                    <Spinner />
                </Stack>
            )}
            <span ref={pageBottomRef} />
        </>
    );
});

export default Items;
