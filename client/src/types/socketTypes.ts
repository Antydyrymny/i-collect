import {
    CollectionPreview,
    CommentRes,
    CommentUpdate,
    ItemPreview,
    ItemResponse,
} from '.';
import {
    getHomeSocket,
    getItemViewerSocket,
    getMainSearchSocket,
    getUserManagerSocket,
} from '../app/services/getSocket';

export type UserManagerSocket = ReturnType<typeof getUserManagerSocket>;
export type ItemViewerSocket = ReturnType<typeof getItemViewerSocket>;
export type HomeSocket = ReturnType<typeof getHomeSocket>;
export type MainSearchSocket = ReturnType<typeof getMainSearchSocket>;

export type ClientToServerEvents = AdminToServerEvents &
    ItemViewerToServerEvents &
    HomeToServerEvents &
    MainSearchToServerEvents;
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
    [HomeToServer.SubscribingToHome]: (
        acknowledgeHomeData: (homeInitialData: HomeInitialData) => void
    ) => void;
    [HomeToServer.RefreshingTags]: (
        acknowledgeNewTags: (newTags: string[]) => void
    ) => void;
    [DefaultEvents.Disconnecting]: () => void;
};
export type ServerToHomeEvents = {
    [ServerToHome.HomeUpdated]: (homeUpdate: HomeUpdate) => void;
};

export type MainSearchToServerEvents = {
    [DefaultEvents.Connection]: () => void;
    [MainSearchToServer.Searching]: (
        query: string,
        acknowledgeSearch: (searchRes: MainSearchRes) => void
    ) => void;
    [DefaultEvents.Disconnecting]: () => void;
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
    RefreshingTags = 'refreshTags',
}
export enum ServerToHome {
    HomeUpdated = 'homeUpdated',
}

export type HomeInitialData = {
    tags: string[];
    latestItems: ItemResponse[];
    largestCollections: CollectionPreview[];
};
export type HomeUpdate = Partial<HomeInitialData>;
export type MainSearchRes = (ItemPreview | CollectionPreview)[];

export enum MainSearchToServer {
    Searching = 'searching',
}
