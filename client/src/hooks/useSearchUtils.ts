import { useCallback, useState } from 'react';

/**
 * Provides basic search utility functions
 * @returns
 * @searchQuery state value
 * @handleSearchChange set query function
 * @clearSearch clear search state function
 */
export function useSearchUtils() {
    const [searchQuery, setSearchQuery] = useState('');
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);
    const clearSearch = useCallback(() => setSearchQuery(''), []);

    return { searchQuery, handleSearchChange, clearSearch };
}
