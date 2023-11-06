import { subscribeToItemUpdates } from '../features/collections';
import { subscribeToHomeUpdates } from '../features/collections/homeEvents';
import { subscribeAdminsToUserEvents } from '../features/manageUsers';

export const subscribeToSocketEvents = () => {
    subscribeAdminsToUserEvents();
    subscribeToItemUpdates();
    subscribeToHomeUpdates();
};
