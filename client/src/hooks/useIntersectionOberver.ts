import { useEffect, useRef, RefObject } from 'react';

/**
 * Run callback on viewbox intersecting with ref
 * @param ref ref to an element to track
 * @param callback function to run on intersection
 * @param isLoading prevent running callback when loading
 * @param moreToFetch disconnect Intersection observer when no more to fetch
 * @param options IntersectionObserver options
 */
export default function useIntersectionObserver(
    ref: RefObject<HTMLElement>,
    callback: () => void,
    isLoading: boolean,
    moreToFetch: boolean,
    options = {
        root: null,
        rootMargin: '20%',
        threshold: 0,
    }
) {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const isLoadingRef = useRef<boolean>(isLoading);

    useEffect(() => {
        isLoadingRef.current = isLoading;
    }, [isLoading]);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !isLoadingRef.current) callback();
        }, options);

        if (ref.current) observerRef.current.observe(ref.current);

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref]);

    useEffect(() => {
        if (!moreToFetch) {
            observerRef.current?.disconnect();
        }
    }, [moreToFetch]);
}
