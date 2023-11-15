import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    useLazyFindUserCollectionQuery,
    useGetUserCollectionsQuery,
    useGetUserPageQuery,
} from '../../app/services/api';
import useIntersectionObserver from '../../hooks/useIntersectionOberver';
import { useInformOfError } from '../../hooks';
import { useLocale } from '../../contexts/locale';
import { useSelectUser } from '../../app/services/features/auth';
import {
    Button,
    CloseButton,
    Col,
    Container,
    FloatingLabel,
    Form,
    InputGroup,
    Row,
    Spinner,
    Stack,
} from 'react-bootstrap';
import CollectionCardPreview from './CollectionCardPreview';
import styles from './userPageStyles.module.scss';
import TooltipOverlay from '../../components/tooltip/TooltipOverlay';
import { ClientRoutes } from '../../types';

function UserPage() {
    const user = useSelectUser();
    const { userId } = useParams();
    const ownerId = user.admin ? userId : undefined;

    const { data: ownerData, ...ownerOptions } = useGetUserPageQuery(ownerId);

    const [searchQuery, setSearchQuery] = useState('');
    const [search, { data: searchResults, ...searchOptions }] =
        useLazyFindUserCollectionQuery();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };
    const submitSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!searchQuery) return;
        search({ query: searchQuery, ownerId });
    };

    const [page, setPage] = useState(0);
    const { data: collectionsData, ...collectionsOptions } = useGetUserCollectionsQuery(
        { page, ownerId },
        { skip: !ownerData }
    );
    const pageBottomRef = useRef<HTMLSpanElement>(null);
    useIntersectionObserver(
        pageBottomRef,
        () => setPage((page) => page + 1),
        collectionsOptions.isFetching,
        collectionsData?.moreToFetch ?? true
    );

    useInformOfError([
        { isError: ownerOptions.isError, error: ownerOptions.error },
        { isError: searchOptions.isError, error: searchOptions.error },
        { isError: collectionsOptions.isError, error: collectionsOptions.error },
    ]);

    const t = useLocale('userPage');

    return (
        <Container className='pb-5'>
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
                            <Form onSubmit={submitSearch}>
                                <InputGroup>
                                    <FloatingLabel
                                        controlId='collectionSearch'
                                        label={t('findCollection')}
                                    >
                                        <Form.Control
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                            type='text'
                                            required
                                            placeholder={t('findCollection')}
                                            className='shadow-none'
                                        />
                                    </FloatingLabel>
                                    <TooltipOverlay
                                        id='clear'
                                        tooltipMessage={t('clear')}
                                        placement='bottom'
                                    >
                                        <InputGroup.Text className='d-none d-sm-flex'>
                                            <CloseButton
                                                onClick={() => setSearchQuery('')}
                                            />
                                        </InputGroup.Text>
                                    </TooltipOverlay>
                                    <Button type='submit' variant='outline-primary'>
                                        {t('search')}
                                    </Button>
                                </InputGroup>
                            </Form>
                        </Col>
                    </>
                )}
            </Row>
            {ownerOptions.isSuccess && (
                <>
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
                                />
                            ))}
                    </Row>
                    <Row className='my-3'>
                        <Link to={ClientRoutes.NewCollection} className='px-0'>
                            <Button>{t('newCollection')}</Button>
                        </Link>
                    </Row>
                    {!(searchQuery && searchResults) && (
                        <Row>
                            {collectionsOptions.isSuccess &&
                                collectionsData?.collections?.map((collection) => (
                                    <CollectionCardPreview
                                        key={collection._id}
                                        collection={collection}
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
