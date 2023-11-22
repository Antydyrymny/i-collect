import api from '../../api';
import { getHomeSocket } from '../../getSocket';
import {
    ApiBuilder,
    HomeInitialData,
    HomeToServer,
    HomeUpdate,
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
        serializeQueryArgs: ({ endpointName }) => endpointName,
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

export const refreshHomeTags = (builder: ApiBuilder) =>
    builder.query<void, void>({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        queryFn: async (_, { dispatch }) => {
            const homeSocket = getHomeSocket();

            const newTags: string[] = await new Promise((resolve) => {
                homeSocket.emit(HomeToServer.RefreshingTags, (newTags) => {
                    resolve(newTags);
                });
            });
            dispatch(
                api.util.updateQueryData(
                    'subscribeToHomeEvents',
                    'subscribeToHomeEvents' as unknown as void,
                    (draft) => {
                        draft.tags = newTags;
                    }
                )
            );
            return { data: undefined };
        },
    });
