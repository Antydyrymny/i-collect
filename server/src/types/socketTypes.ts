import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export type ClientToServerEvents = AdminToServerEvents & CollectionViewerToServerEvents;
export type ServerToClientEvents = ServerToAdminEvents & ServerToCollectionViewerEvents;

export type AdminToServerEvents = {
    [DefaultEvents.Connection]: () => void;
    [DefaultEvents.Disconnecting]: () => void;
};
export type ServerToAdminEvents = {
    [ServerToAdmin.UsersUpdated]: () => void;
};

export type CollectionViewerToServerEvents = {
    [DefaultEvents.Connection]: () => void;
    [DefaultEvents.Disconnecting]: () => void;
};
export type ServerToCollectionViewerEvents = {
    [ServerToCollectionViewer.NewItems]: () => void;
    [ServerToCollectionViewer.NewComments]: () => void;
    [ServerToCollectionViewer.NewLikes]: () => void;
};

export enum DefaultEvents {
    Connection = 'connection',
    Disconnecting = 'disconnecting',
}

export enum ServerToAdmin {
    UsersUpdated = 'usersUpdated',
}

export enum CollectionViewerToServer {}

export enum ServerToCollectionViewer {
    NewItems = 'newItems',
    NewComments = 'newComments',
    NewLikes = 'newLikes',
}

export enum DefaultRooms {
    onlineAdmins = 'onlineAdmins',
}

export type AdminSocket = Socket<
    AdminToServerEvents,
    ServerToAdminEvents,
    DefaultEventsMap,
    unknown
>;

export type CollectionsSocket = Socket<
    DefaultEventsMap, //! -------------------
    ServerToCollectionViewerEvents,
    DefaultEventsMap,
    unknown
>;
