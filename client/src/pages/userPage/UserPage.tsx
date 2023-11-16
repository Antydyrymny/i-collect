import { useCallback, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    useLazyFindUserCollectionQuery,
    useGetUserCollectionsQuery,
    useGetUserPageQuery,
} from '../../app/services/api';
import { useInfiniteScrollLoading, useInformOfError, useSearchUtils } from '../../hooks';
import { useLocale } from '../../contexts/locale';
import { useSelectUser } from '../../app/services/features/auth';
import { Button, Col, Container, Row, Spinner, Stack } from 'react-bootstrap';
import CollectionCardPreview from './CollectionCardPreview';
import styles from './userPageStyles.module.scss';
import { ClientRoutes } from '../../types';
import { SearchBar } from '../../components';

function UserPage() {
    const user = useSelectUser();
    const { userId } = useParams();
    const ownerId = user.admin ? userId : undefined;

    const { data: ownerData, ...ownerOptions } = useGetUserPageQuery(ownerId);

    const { searchQuery, handleSearchChange, clearSearch } = useSearchUtils();
    const [search, { data: searchResults, ...searchOptions }] =
        useLazyFindUserCollectionQuery();
    const submitSearch = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!searchQuery) return;
            search({ query: searchQuery, ownerId });
        },
        [ownerId, search, searchQuery]
    );

    const [page, setPage] = useState(0);
    const { data: collectionsData, ...collectionsOptions } = useGetUserCollectionsQuery(
        { page, ownerId },
        { skip: !ownerData }
    );
    const pageBottomRef = useRef<HTMLSpanElement>(null);
    useInfiniteScrollLoading(
        pageBottomRef,
        () => setPage((page) => page + 1),
        collectionsOptions.isFetching ||
            searchOptions.isLoading ||
            !!(searchQuery && searchResults),
        collectionsData?.moreToFetch ?? true
    );

    useInformOfError([
        { isError: ownerOptions.isError, error: ownerOptions.error },
        { isError: searchOptions.isError, error: searchOptions.error },
        { isError: collectionsOptions.isError, error: collectionsOptions.error },
    ]);

    const t = useLocale('userPage');

    return (
        <Container>
            <Row>
                {ownerOptions.isFetching && (
                    <Stack
                        className={`${styles.spinner} d-flex justify-content-center align-items-center`}
                    >
                        <Spinner />
                    </Stack>
                )}
                {ownerOptions.isSuccess && (
                    <>
                        <Col className='ps-0 pe-0'>
                            <h2 className='mb-1'> {ownerData?.name}</h2>
                            <p>
                                {t('totalCollections') + ownerData?.collections?.length}
                            </p>
                        </Col>
                        <Col xs={12} md={6} lg={8} className='ps-0 pe-0'>
                            <SearchBar
                                searchQuery={searchQuery}
                                handleSearchChange={handleSearchChange}
                                clearSearch={clearSearch}
                                submitSearch={submitSearch}
                                label={t('findCollection')}
                                placeholder={t('findCollection')}
                            />
                        </Col>
                    </>
                )}
            </Row>
            {ownerOptions.isSuccess && (
                <>
                    <Row className='my-3'>
                        <Col className='px-0'>
                            <Link to={ClientRoutes.NewCollection}>
                                <Button>{t('newCollection')}</Button>
                            </Link>
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        {searchOptions.isFetching && (
                            <Stack className='my-5 d-flex justify-content-center align-items-center'>
                                <Spinner />
                            </Stack>
                        )}
                        {searchQuery &&
                            searchOptions.isSuccess &&
                            searchOptions.originalArgs?.query === searchQuery &&
                            searchResults?.map((foundCollection) => (
                                <CollectionCardPreview
                                    key={foundCollection._id}
                                    collection={foundCollection}
                                    userId={ownerId}
                                />
                            ))}
                    </Row>

                    {!(searchQuery && searchResults) && (
                        <Row>
                            {collectionsOptions.isSuccess &&
                                collectionsData?.collections?.map((collection) => (
                                    <CollectionCardPreview
                                        key={collection._id}
                                        collection={collection}
                                        userId={ownerId}
                                    />
                                ))}
                            {collectionsOptions.isFetching && (
                                <Stack className='mt-5 d-flex justify-content-center align-items-center'>
                                    <Spinner />
                                </Stack>
                            )}
                        </Row>
                    )}
                </>
            )}
            <span ref={pageBottomRef} />
        </Container>
    );
}

export default UserPage;
