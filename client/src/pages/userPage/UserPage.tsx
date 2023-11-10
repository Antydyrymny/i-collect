import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    useFindUserCollectionQuery,
    useGetUserCollectionsQuery,
    useGetUserPageQuery,
} from '../../app/services/api';
import useIntersectionObserver from '../../hooks/useIntersectionOberver';
import { useInformOfError } from '../../hooks';
import { useLocale } from '../../contexts/locale';
import { useSelectUser } from '../../app/services/features/auth';
import { Container } from 'react-bootstrap';

function UserPage() {
    const t = useLocale('login');

    const user = useSelectUser();
    const { userId } = useParams();
    const ownerId = user.admin ? userId : undefined;

    const {
        data: ownerData,
        isFetching: fetchingOwner,
        isError: isOwnerErr,
        error: ownerErr,
    } = useGetUserPageQuery(ownerId);

    const [searchQuery, setSearchQuery] = useState('');
    const {
        data: searchResults,
        isFetching: searching,
        isError: isSearchErr,
        error: searchErr,
    } = useFindUserCollectionQuery(
        { query: searchQuery, ownerId },
        { skip: !searchQuery }
    );

    const [page, setPage] = useState(0);
    const {
        data: collections,
        isFetching,
        isError,
        error,
    } = useGetUserCollectionsQuery(
        { page, ownerId },
        { skip: !ownerData || !!searchResults }
    );

    const pageBottomRef = useRef<HTMLSpanElement>(null);
    useIntersectionObserver(pageBottomRef, () => setPage((page) => page + 1));

    useInformOfError([
        { isError, error },
        { isError: isSearchErr, error: searchErr },
        { isError: isOwnerErr, error: ownerErr },
    ]);

    return (
        <Container className='mt-5'>
            UserPage
            <span ref={pageBottomRef} />
        </Container>
    );
}

export default UserPage;
