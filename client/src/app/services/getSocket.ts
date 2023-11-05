import { io, Socket } from 'socket.io-client';
import {
    Routes,
    AdminToServerEvents,
    ServerToAdminEvents,
    ItemViewerToServerEvents,
    ServerToItemViewerEvents,
} from '../../types';

const url =
    import.meta.env.VITE_ENV === 'DEV'
        ? import.meta.env.VITE_DEV_URL
        : import.meta.env.VITE_SERVER_URL;

let userManagerSocket: Socket<ServerToAdminEvents, AdminToServerEvents>;
export const getUserManagerSocket = () => {
    if (!userManagerSocket) {
        userManagerSocket = io(url + Routes.ManageUsersSocket);
    }
    return userManagerSocket;
};

let collectionViewerSocket: Socket<ItemViewerToServerEvents, ServerToItemViewerEvents>;
export const getCollectionViewerSocket = () => {
    if (!collectionViewerSocket) {
        collectionViewerSocket = io(url + Routes.ManageUsersSocket); //!------
    }
    return collectionViewerSocket;
};
