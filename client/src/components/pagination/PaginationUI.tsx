import { usePagination } from '../../hooks/usePagination';
import { Pagination } from 'react-bootstrap';

function PaginationUI({ pages }: { pages: number }) {
    const {
        curPage,
        allowPrevPage,
        allowNextPage,
        goToPrevPage,
        goToNextPage,
        goToFirstPage,
        goToLastPage,
        goToPageX,
    } = usePagination(pages);

    return (
        <Pagination>
            <Pagination.First onClick={goToFirstPage} className='d-none d-md-block' />
            <Pagination.Prev onClick={goToPrevPage} disabled={!allowPrevPage} />
            <Pagination.Item
                onClick={() => goToPageX(1)}
                className={`${curPage > 3 ? 'd-block' : 'd-none'} d-none d-md-block`}
            >
                {1}
            </Pagination.Item>
            <Pagination.Ellipsis
                onClick={() => goToPageX(curPage - 3)}
                className={`${curPage > 4 ? 'd-block' : 'd-none'} d-none d-md-block`}
            />

            <Pagination.Item
                onClick={() => goToPageX(curPage - 2)}
                className={curPage > 2 ? 'd-block' : 'd-none'}
            >
                {curPage - 2}
            </Pagination.Item>
            <Pagination.Item
                onClick={() => goToPageX(curPage - 1)}
                className={curPage > 1 ? 'd-block' : 'd-none'}
            >
                {curPage - 1}
            </Pagination.Item>
            <Pagination.Item active>{curPage}</Pagination.Item>
            <Pagination.Item
                onClick={() => goToPageX(curPage + 1)}
                className={pages - curPage > 0 ? 'd-block' : 'd-none'}
            >
                {curPage + 1}
            </Pagination.Item>
            <Pagination.Item
                onClick={() => goToPageX(curPage + 2)}
                className={pages - curPage > 1 ? 'd-block' : 'd-none'}
            >
                {curPage + 2}
            </Pagination.Item>

            <Pagination.Ellipsis
                onClick={() => goToPageX(curPage + 3)}
                className={`${
                    pages - curPage > 3 ? 'd-block' : 'd-none'
                } d-none d-md-block`}
            />
            <Pagination.Item
                onClick={() => goToPageX(pages)}
                className={`${
                    pages - curPage > 2 ? 'd-block' : 'd-none'
                } d-none d-md-block`}
            >
                {pages}
            </Pagination.Item>
            <Pagination.Next onClick={goToNextPage} disabled={!allowNextPage} />
            <Pagination.Last onClick={goToLastPage} className='d-none d-md-block' />
        </Pagination>
    );
}

export default PaginationUI;
