import { CommentRes, CommentUpdate } from '.';
import { getUserManagerSocket } from '../app/services/getSocket';

export type UserManagerSocket = ReturnType<typeof getUserManagerSocket>;

export type ClientToServerEvents = AdminToServerEvents & ItemViewerToServerEvents;
export type ServerToClientEvents = ServerToAdminEvents & ServerToItemViewerEvents;

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
    [ItemViewerToServer.AutocompleteTag]: (query: string) => void;
    [DefaultEvents.Disconnecting]: () => void;
};
export type ServerToItemViewerEvents = {
    [ServerToItemViewer.LikesUpdated]: (newLikesNumber: number) => void;
    [ServerToItemViewer.NewComment]: (newComment: CommentRes) => void;
    [ServerToItemViewer.CommentUpdated]: (commentUpdate: CommentUpdate) => void;
    [ServerToItemViewer.CommentDeleted]: (_id: string) => void;
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
