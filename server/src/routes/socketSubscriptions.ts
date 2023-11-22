import {
    subscribeToHomeUpdates,
    subscribeToItemUpdates,
    subscribeToMainSearch,
} from '../features/collections';
import { subscribeAdminsToUserEvents } from '../features/manageUsers';

export const subscribeToSocketEvents = () => {
    subscribeAdminsToUserEvents();
    subscribeToItemUpdates();
    subscribeToHomeUpdates();
    subscribeToMainSearch();
};
