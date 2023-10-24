import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export type ApiSocket = Socket<
    DefaultEventsMap,
    ServerToClientEvents,
    DefaultEventsMap,
    unknown
>;

export enum ClientToServer {
    Connection = 'connection',
    Disconnecting = 'disconnecting',
}

export enum ServerToClient {
    NewItems = 'newItems',
    NewComments = 'newComments',
    NewLikes = 'newLikes',
}

export enum DefaultRooms {}

export type ServerToClientEvents = {
    [ServerToClient.NewItems]: () => void;
    [ServerToClient.NewComments]: () => void;
    [ServerToClient.NewLikes]: () => void;
};

export enum DefaultRooms {
    lobby = 'lobby',
}
