import { useOutletContext } from 'react-router-dom';
import { CollectionResponse } from '../../../types';

export function useCollection() {
    return useOutletContext<CollectionResponse>();
}
