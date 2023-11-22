import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { useMainSearchQuery } from '../../../app/services/api';
import { useInformOfError } from '../../../hooks';
import { SearchBar } from '../../../components';
import { Container, Dropdown, Spinner } from 'react-bootstrap';
import { ClientRoutes } from '../../../types';
import { useLocale } from '../../../contexts/locale';

function NavSearchBar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, debouncedQueryOptions] = useDebounce(searchQuery, 250);

    const { data: searchResults, ...searchOptions } = useMainSearchQuery(debouncedQuery);
    useInformOfError({ isError: searchOptions.isError, error: searchOptions.error });

    const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);
    const clearSearch = useCallback(() => {
        setSearchQuery('');
    }, []);

    const location = useLocation();
    useEffect(() => {
        setSearchQuery('');
        debouncedQueryOptions.flush();
    }, [debouncedQueryOptions, location.pathname]);

    useEffect(() => {
        if (searchQuery === '') debouncedQueryOptions.flush();
    }, [debouncedQueryOptions, searchQuery]);

    const navigate = useNavigate();

    const submitSearch = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!searchQuery) return;
            navigate(ClientRoutes.Home, { state: { query: searchQuery } });
        },
        [navigate, searchQuery]
    );

    const [isFocused, setIsFocused] = useState(false);
    const [dropDownIsActive, setIsActive] = useState(false);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
    }, []);
    const handleBlur = useCallback(() => {
        setIsFocused(false);
    }, []);
    const handleActive = () => {
        setIsActive(true);
    };
    useEffect(() => {
        const handleMouseUp = () => {
            setIsActive(false);
        };
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const t = useLocale('navbar');

    return (
        <div className='position-relative' onFocus={handleFocus} onBlur={handleBlur}>
            <SearchBar
                searchQuery={searchQuery}
                handleSearchChange={handleQueryChange}
                clearSearch={clearSearch}
                submitSearch={submitSearch}
                hideFloatingLabel
                hideSearchButton
            />
            <Dropdown show={!!searchResults?.length && (isFocused || dropDownIsActive)}>
                <Dropdown.Menu className='position-absolute end-0 start-0 overflow-x-hidden'>
                    {searchOptions.isFetching && (
                        <Container className='d-flex justify-content-center'>
                            <Spinner />
                        </Container>
                    )}
                    {searchResults?.map((suggestion, ind) => (
                        <Dropdown.Item
                            key={ind}
                            as={'div'}
                            onMouseDown={handleActive}
                            onDragStart={(e) => {
                                e.preventDefault();
                            }}
                        >
                            {
                                <Link
                                    to={
                                        ('itemNumber' in suggestion
                                            ? ClientRoutes.CollectionPath
                                            : ClientRoutes.ItemPath) + suggestion._id
                                    }
                                >
                                    <span className='d-flex justify-content-between'>
                                        <span>{suggestion.name}</span>
                                        {'itemNumber' in suggestion && (
                                            <span className='text-secondary'>
                                                {t('collection')}
                                            </span>
                                        )}
                                    </span>
                                </Link>
                            }
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}

export default NavSearchBar;
