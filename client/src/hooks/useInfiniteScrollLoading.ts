import { useEffect, useRef, RefObject } from 'react';

/**
 * Run callback on viewbox intersecting with ref
 * @param ref ref to an element to track
 * @param callback function to run on intersection
 * @param isLoading prevent running callback when loading
 * @param moreToFetch disconnect Intersection observer when no more to fetch
 * @param options IntersectionObserver options
 */
export function useInfiniteScrollLoading(
    ref: RefObject<HTMLElement>,
    callback: () => void,
    isLoading: boolean,
    moreToFetch: boolean,
    options = {
        root: null,
        rootMargin: '0%',
        threshold: 0,
    }
) {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const isLoadingRef = useRef<boolean>(isLoading);
    const moreToFetchRef = useRef<boolean>(moreToFetch);

    useEffect(() => {
        isLoadingRef.current = isLoading;
        moreToFetchRef.current = moreToFetch;
    }, [isLoading, moreToFetch]);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !isLoadingRef.current && moreToFetchRef.current)
                callback();
        }, options);

        if (ref.current) observerRef.current.observe(ref.current);

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref]);
}
