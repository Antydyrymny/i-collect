import { getHomeSocket } from '../../getSocket';
import {
    ApiBuilder,
    HomeInitialData,
    HomeToServer,
    HomeUpdate,
    ItemPreview,
    ServerToHome,
} from '../../../../types';

export const subscribeToHomeEvents = (builder: ApiBuilder) =>
    builder.query<HomeInitialData, void>({
        queryFn: () => {
            const homeSocket = getHomeSocket();
            return new Promise((resolve) => {
                homeSocket.emit(HomeToServer.SubscribingToHome, (homeInitialData) => {
                    resolve({
                        data: homeInitialData,
                    });
                });
            });
        },
        async onCacheEntryAdded(
            _,
            { cacheDataLoaded, cacheEntryRemoved, updateCachedData }
        ) {
            try {
                await cacheDataLoaded;

                const homeSocket = getHomeSocket();
                homeSocket.on(ServerToHome.HomeUpdated, (homeUpdate: HomeUpdate) => {
                    updateCachedData((draft) => {
                        draft.latestItems = homeUpdate.latestItems ?? draft.latestItems;
                        draft.largestCollections =
                            homeUpdate.largestCollections ?? draft.largestCollections;
                    });
                });

                await cacheEntryRemoved;

                homeSocket.off(ServerToHome.HomeUpdated);
            } catch {
                // if cacheEntryRemoved resolved before cacheDataLoaded,
                // cacheDataLoaded throws
            }
        },
    });

export const homePageSearch = (builder: ApiBuilder) =>
    builder.query<ItemPreview[], string>({
        queryFn: (query) => {
            const homeSocket = getHomeSocket();

            return new Promise((resolve) => {
                homeSocket.emit(HomeToServer.SearchingItems, query, (foundItems) => {
                    resolve({
                        data: foundItems,
                    });
                });
            });
        },
    });
