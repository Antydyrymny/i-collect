import { useEffect, useRef, RefObject } from 'react';

/**
 * Run callback on viewbox intersecting with ref
 * @param ref ref to an element to track
 * @param callback function to run on intersection
 * @param options IntersectionObserver options
 */
export default function useIntersectionObserver(
    ref: RefObject<HTMLElement>,
    callback: () => void,
    options = {
        root: null,
        rootMargin: '20%',
        threshold: 0,
    }
) {
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) callback();
        }, options);
    }, [callback, options]);

    useEffect(() => {
        if (ref.current && observerRef.current) observerRef.current.observe(ref.current);

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [ref]);
}
