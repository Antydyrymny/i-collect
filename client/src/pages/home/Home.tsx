import { useLocation } from 'react-router-dom';
import {
    useMainSearchQuery,
    useSubscribeToHomeEventsQuery,
} from '../../app/services/api';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { CardWrapper, MainSpinner, SearchBar } from '../../components';
import TagCloud from './TagCloud';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInformOfError } from '../../hooks';
import { useDebounce } from 'use-debounce';
import ItemPreviewRow from '../collection/ItemPreviewRow';
import SearchTable from './SearchTable';
import CollectionPreviewRow from './CollectionPreviewRow';
import LargestCollections from './LargestCollections';
import LatestItems from './LatestItems';
import { useLocale } from '../../contexts/locale';

function Home() {
    const { data: homeData, ...homeOptions } = useSubscribeToHomeEventsQuery();
    const tags = useMemo(() => homeData?.tags || [], [homeData?.tags]);

    const location = useLocation();

    const [searchQuery, setSearchQuery] = useState(location.state?.query ?? '');
    const [debouncedQuery, debouncedQueryOptions] = useDebounce(searchQuery, 500);

    const { data: searchResults, ...searchOptions } = useMainSearchQuery(debouncedQuery);
    useInformOfError({ isError: searchOptions.isError, error: searchOptions.error });

    const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);
    const handleTagClick = useCallback(
        (tag: string) => {
            setSearchQuery(tag);
            debouncedQueryOptions.flush();
        },
        [debouncedQueryOptions]
    );
    const clearSearch = useCallback(() => {
        setSearchQuery('');
    }, []);

    useEffect(() => {
        if (searchQuery === '') debouncedQueryOptions.flush();
    }, [debouncedQueryOptions, searchQuery]);
    const submitSearch = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!searchQuery) return;
            debouncedQueryOptions.flush();
        },
        [searchQuery, debouncedQueryOptions]
    );

    const t = useLocale('home');

    return (
        <>
            {homeOptions.isLoading && <MainSpinner />}
            {homeOptions.isSuccess && (
                <>
                    <Row>
                        <Col lg={{ span: 4, order: 'last', offset: 1 }}>
                            <div className='d-flex justify-content-center align-items-start'>
                                <TagCloud tags={tags} handleTagClick={handleTagClick} />
                            </div>
                        </Col>
                        <Col lg={{ order: 'first', span: 7 }}>
                            <SearchBar
                                searchQuery={searchQuery}
                                handleSearchChange={handleQueryChange}
                                clearSearch={clearSearch}
                                submitSearch={submitSearch}
                                label={t('searchLabel')}
                                placeholder={t('searchPlaceholder')}
                                hideFloatingLabel
                                asHeading
                            />
                            {searchQuery && searchOptions.isFetching && (
                                <Container className='mt-5 d-flex justify-content-center align-items-center'>
                                    <Spinner />
                                </Container>
                            )}
                            {searchQuery &&
                                searchOptions.isSuccess &&
                                searchOptions.originalArgs === searchQuery && (
                                    <>
                                        {searchResults?.length === 0 && (
                                            <Container className='mt-5 text-center'>
                                                <b>{t('noResults')}</b>
                                            </Container>
                                        )}
                                        {searchResults?.length !== 0 && (
                                            <SearchTable>
                                                {searchResults?.map((foundItem) =>
                                                    'itemNumber' in foundItem ? (
                                                        <CollectionPreviewRow
                                                            key={foundItem._id}
                                                            collection={foundItem}
                                                        />
                                                    ) : (
                                                        <ItemPreviewRow
                                                            key={foundItem._id}
                                                            item={foundItem}
                                                            allowEdit={false}
                                                            displayType={true}
                                                            displayAdditionalFields={
                                                                false
                                                            }
                                                        />
                                                    )
                                                )}
                                            </SearchTable>
                                        )}
                                    </>
                                )}
                            <div className='my-5'>
                                <CardWrapper>
                                    <h6>{t('largestCollections')}</h6>
                                    <LargestCollections
                                        collections={homeData!.largestCollections}
                                    />
                                </CardWrapper>
                            </div>
                            <div className='mb-5'>
                                <CardWrapper>
                                    <h6>{t('latestItems')}</h6>
                                    <LatestItems items={homeData!.latestItems} />
                                </CardWrapper>
                            </div>
                        </Col>
                    </Row>
                </>
            )}
        </>
    );
}

export default Home;
