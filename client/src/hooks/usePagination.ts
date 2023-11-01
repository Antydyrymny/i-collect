import { useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

type PaginationResult = {
    curPage: number;
    allowPrevPage: boolean;
    allowNextPage: boolean;
    goToPrevPage: () => void;
    goToNextPage: () => void;
    goToFirstPage: () => void;
    goToLastPage: () => void;
    goToPageX: (chosenPage: number) => void;
};
/**
 * Provides tools for pagination for the array of entries with known length
 * @param pages total number of pages
 * @returns array of values:
 * @curPage current page number,
 * @allowPrevPage shows if previous page is present,
 * @allowNextPage shows if next page is present,
 * @goToPrevPage navigates to previous page,
 * @goToNextPage navigates to next page,
 * @goToFirst navigates to first page,
 * @goToLast navigates to last page
 * @goToPageX navigate to page with a given number
 */
export function usePagination(pages: number): PaginationResult {
    const [searchParams, setSearchParams] = useSearchParams();
    const curPage = useMemo(() => Number(searchParams.get('page') || 1), [searchParams]);
    // if curPage is less than 0 - go to page 1,
    // if it is larger than the last page - go to last page
    useEffect(() => {
        if (curPage < 0) {
            goToFirstPage();
        } else if (curPage > pages && pages !== 1) {
            goToLastPage();
        }
        // setURLSearchParams of useSearchParams is not stable, considered a bug
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curPage, pages]);

    const allowPrevPage = useMemo(() => curPage > 1, [curPage]);
    const allowNextPage = useMemo(() => curPage < pages, [curPage, pages]);
    const goToPrevPage = useCallback(
        () =>
            setSearchParams((prevParams) => {
                prevParams.set('page', (curPage - 1).toString());
                return prevParams;
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [curPage]
    );
    const goToNextPage = useCallback(
        () =>
            setSearchParams((prevParams) => {
                prevParams.set('page', (curPage + 1).toString());
                return prevParams;
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [curPage]
    );
    const goToFirstPage = useCallback(
        () => setSearchParams({ page: '1' }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
    const goToLastPage = useCallback(
        () => setSearchParams({ page: pages.toString() }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [pages]
    );
    const goToPageX = useCallback(
        (pageNumber: number) => setSearchParams({ page: pageNumber.toString() }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
    return {
        curPage: +curPage,
        allowPrevPage,
        allowNextPage,
        goToPrevPage,
        goToNextPage,
        goToFirstPage,
        goToLastPage,
        goToPageX,
    };
}
