import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Redirect to target page if condition is met
 * @param target string of page route
 * @param condition boolean expression
 */
export function useRedirect(target = '/', condition = true) {
    const navigate = useNavigate();

    useEffect(() => {
        if (condition) {
            navigate(target);
        }
    }, [condition, target, navigate]);
}
