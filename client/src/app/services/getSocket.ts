import { io, Socket } from 'socket.io-client';
import {
    Routes,
    AdminToServerEvents,
    ServerToAdminEvents,
    ItemViewerToServerEvents,
    ServerToItemViewerEvents,
    HomeToServerEvents,
    MainSearchToServerEvents,
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

let itemViewerSocket: Socket<ServerToItemViewerEvents, ItemViewerToServerEvents>;
export const getItemViewerSocket = () => {
    if (!itemViewerSocket) {
        itemViewerSocket = io(url + Routes.ItemSocket);
    }
    return itemViewerSocket;
};

let homeSocket: Socket<Record<string, never>, HomeToServerEvents>;
export const getHomeSocket = () => {
    if (!homeSocket) {
        homeSocket = io(url + Routes.HomeSocket);
    }
    return homeSocket;
};

let mainSearchSocket: Socket<EventSourceEventMap, MainSearchToServerEvents>;
export const getMainSearchSocket = () => {
    if (!mainSearchSocket) {
        mainSearchSocket = io(url + Routes.MainSearchSocket);
    }
    return mainSearchSocket;
};
