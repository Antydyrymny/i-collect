import { io } from '../../app';
import {
    getLargestCollections,
    getLatestItems,
    largestCollections,
    largestCollectionsLimit,
    latestItems,
    latestItemsLimit,
    updatesRequired,
} from '../../data';
import {
    DefaultEvents,
    DefaultRooms,
    HomeToServer,
    HomeUpdate,
    Routes,
    ServerToHome,
} from '../../types';
import { getRandomTags, itemSearch } from './utils';

export function subscribeToHomeUpdates() {
    io.of(Routes.Api + Routes.HomeSocket).on(DefaultEvents.Connection, (socket) => {
        socket.on(HomeToServer.SubscribingToHome, async (acknowledgeHomeData) => {
            socket.join(DefaultRooms.Home);
            const tags = await getRandomTags();

            acknowledgeHomeData({
                latestItems,
                largestCollections,
                tags,
            });
        });

        socket.on(HomeToServer.RefreshingTags, async (acknowledgeNewTags) => {
            acknowledgeNewTags(await getRandomTags());
        });

        socket.on(HomeToServer.SearchingItems, async (query, acknowledgeSearch) => {
            acknowledgeSearch(await itemSearch({ query, searchInCollections: true }));
        });
    });
}

setInterval(async () => {
    if (!updatesRequired.latestItems && !updatesRequired.largestCollections) return;

    if (latestItems.length < latestItemsLimit) {
        await getLatestItems();
    }
    if (largestCollections.length < largestCollectionsLimit) {
        await getLargestCollections();
    }

    const update: HomeUpdate = {};
    if (updatesRequired.latestItems)
        update.latestItems = latestItems.slice(0, latestItemsLimit);
    if (updatesRequired.largestCollections)
        update.largestCollections = largestCollections.slice(0, largestCollectionsLimit);

    io.of(Routes.Api + Routes.HomeSocket)
        .to(DefaultRooms.Home)
        .emit(ServerToHome.HomeUpdated, update);

    updatesRequired.latestItems = false;
    updatesRequired.largestCollections = false;
}, 5000);
