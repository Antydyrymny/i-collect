import { io } from '../../app';
import { DefaultEvents, MainSearchToServer, Routes } from '../../types';
import { itemSearch } from './utils';

export function subscribeToMainSearch() {
    io.of(Routes.Api + Routes.MainSearchSocket).on(DefaultEvents.Connection, (socket) => {
        socket.on(MainSearchToServer.Searching, async (query, acknowledgeSearch) => {
            acknowledgeSearch(await itemSearch({ query, searchInCollections: true }));
        });
    });
}
