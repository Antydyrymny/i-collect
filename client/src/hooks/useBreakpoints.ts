import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Breakpoint } from '../types';

const resolveBreakpoint = (width: number): Breakpoint => {
    if (width < 576) return 'xs';
    if (width < 768) return 'sm';
    if (width < 992) return 'md';
    if (width < 1200) return 'lg';
    if (width < 1440) return 'xl';
    return 'xxl';
};

export const useBreakpoints = () => {
    const [size, setSize] = useState(() => resolveBreakpoint(window.innerWidth));
    const update = useDebouncedCallback(() => {
        setSize(resolveBreakpoint(window.innerWidth));
    }, 200);

    useEffect(() => {
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, [update]);

    return size;
};
