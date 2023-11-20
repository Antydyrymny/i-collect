import {
    useHomePageSearchQuery,
    useSubscribeToHomeEventsQuery,
} from '../../app/services/api';
import { Col, Container, Dropdown, Row, Spinner } from 'react-bootstrap';
import { MainSpinner, SearchBar } from '../../components';
import TagCloud from './TagCloud';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInformOfError } from '../../hooks';
import { useDebounce } from 'use-debounce';
import ItemTable from '../collection/ItemTable';
import ItemPreviewRow from '../collection/ItemPreviewRow';

function Home() {
    const { data: homeData, ...homeOptions } = useSubscribeToHomeEventsQuery();
    const tags = useMemo(() => homeData?.tags || [], [homeData?.tags]);

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, debouncedQueryOptions] = useDebounce(searchQuery, 250);

    const { data: searchResults, ...searchOptions } =
        useHomePageSearchQuery(debouncedQuery);
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

    return (
        <>
            {homeOptions.isLoading && <MainSpinner />}
            {homeOptions.isSuccess && (
                <>
                    <TagCloud tags={tags} handleTagClick={handleTagClick} />
                    <Row className='d-flex justify-content-center mt-4'>
                        <Col xl={5} lg={6} md={9} sm={12} className='position-relative'>
                            <SearchBar
                                searchQuery={searchQuery}
                                handleSearchChange={handleQueryChange}
                                clearSearch={clearSearch}
                                submitSearch={submitSearch}
                                label='Search'
                                placeholder='Enter search'
                                hideFloatingLabel
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {searchQuery &&
                                searchOptions.isSuccess &&
                                searchOptions.originalArgs === searchQuery && (
                                    <ItemTable allowEdit={false}>
                                        {searchResults?.map((foundItem) => (
                                            <ItemPreviewRow
                                                key={foundItem._id}
                                                item={foundItem}
                                                allowEdit={false}
                                                displayAllFields={false}
                                            />
                                        ))}
                                    </ItemTable>
                                )}
                        </Col>
                    </Row>
                </>
            )}
        </>
    );
}

export default Home;
