import { io, Socket } from 'socket.io-client';
import {
    Routes,
    AdminToServerEvents,
    ServerToAdminEvents,
    ItemViewerToServerEvents,
    ServerToItemViewerEvents,
    HomeToServerEvents,
    ServerToHomeEvents,
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

let itemViewerSocket: Socket<ItemViewerToServerEvents, ServerToItemViewerEvents>;
export const getItemViewerSocket = () => {
    if (!itemViewerSocket) {
        itemViewerSocket = io(url + Routes.ItemSocket);
    }
    return itemViewerSocket;
};

let homeSocket: Socket<HomeToServerEvents, ServerToHomeEvents>;
export const getHomeSocket = () => {
    if (!homeSocket) {
        homeSocket = io(url + Routes.HomeSocket);
    }
    return homeSocket;
};
