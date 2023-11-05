import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { CommentRes, CommentUpdate } from './comments';

export type ClientToServerEvents = AdminToServerEvents &
    ItemViewerToServerEvents &
    HomeToServerEvents;
export type ServerToClientEvents = ServerToAdminEvents &
    ServerToItemViewerEvents &
    ServerToHomeEvents;

export type AdminToServerEvents = {
    [DefaultEvents.Connection]: () => void;
    [AdminToServer.SubscribingToUserUpdates]: (adminId: string) => void;
    [DefaultEvents.Disconnecting]: () => void;
};
export type ServerToAdminEvents = {
    [ServerToAdmin.UsersUpdated]: () => void;
};

export type ItemViewerToServerEvents = {
    [DefaultEvents.Connection]: () => void;
    [ItemViewerToServer.SubscribingToItem]: (itemdId: string) => void;
    [ItemViewerToServer.AutocompleteTag]: (
        query: string,
        acknowledgeTag: (tagSuggestions: string[]) => void
    ) => void;
};
export type ServerToItemViewerEvents = {
    [ServerToItemViewer.LikesUpdated]: (newLikesNumber: number) => void;
    [ServerToItemViewer.NewComment]: (newComment: CommentRes) => void;
    [ServerToItemViewer.CommentUpdated]: (commentUpdate: CommentUpdate) => void;
    [ServerToItemViewer.CommentDeleted]: (_id: string) => void;
};

export type HomeToServerEvents = {
    [DefaultEvents.Connection]: () => void;
    [HomeToServer.SubscribingToHome]: () => void;
    [DefaultEvents.Disconnecting]: () => void;
};
export type ServerToHomeEvents = {
    [ServerToHome.TopCollectionsUpdated]: () => void;
    [ServerToHome.LastItemsUpdated]: () => void;
};

export enum DefaultEvents {
    Connection = 'connection',
    Disconnecting = 'disconnecting',
}

export enum AdminToServer {
    SubscribingToUserUpdates = 'subToUsers',
}
export enum ServerToAdmin {
    UsersUpdated = 'usersUpdated',
}

export enum ItemViewerToServer {
    SubscribingToItem = 'subToItem',
    AutocompleteTag = 'autocompleteTag',
}
export enum ServerToItemViewer {
    LikesUpdated = 'likesUpdated',
    NewComment = 'newComment',
    CommentUpdated = 'commentUpdated',
    CommentDeleted = 'commentDeleted',
}

export enum HomeToServer {
    SubscribingToHome = 'subToHome',
}
export enum ServerToHome {
    TopCollectionsUpdated = 'topCollectionsUpdated',
    LastItemsUpdated = 'lastItemsUpdated',
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
    ItemViewerToServerEvents,
    ServerToItemViewerEvents,
    DefaultEventsMap,
    unknown
>;

export type HomeSocket = Socket<
    HomeToServerEvents,
    ServerToHomeEvents,
    DefaultEventsMap,
    unknown
>;
