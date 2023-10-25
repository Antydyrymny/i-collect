import { io, Socket } from 'socket.io-client';
import {
    Routes,
    AdminToServerEvents,
    ServerToAdminEvents,
    CollectionViewerToServerEvents,
    ServerToCollectionViewerEvents,
} from '../../types';

const url =
    import.meta.env.VITE_ENV === 'DEV'
        ? import.meta.env.VITE_DEV_URL
        : import.meta.env.VITE_SERVER_URL;

let userManagerSocket: Socket<ServerToAdminEvents, AdminToServerEvents>;
export const getUserManagerSocket = () => {
    if (!userManagerSocket) {
        userManagerSocket = io(url + Routes.ManageUsers);
    }
    return userManagerSocket;
};

let collectionViewerSocket: Socket<
    ServerToCollectionViewerEvents,
    CollectionViewerToServerEvents
>;
export const getCollectionViewerSocket = () => {
    if (!collectionViewerSocket) {
        collectionViewerSocket = io(url + Routes.ManageUsers); //!------
    }
    return collectionViewerSocket;
};
