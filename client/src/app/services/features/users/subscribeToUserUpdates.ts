import { ApiBuilder, ServerToAdmin } from '../../../../types';
import apiSlice from '../../api';
import { getUserManagerSocket } from '../../getSocket';

export const subscribeToUsers = (builder: ApiBuilder) =>
    builder.query<void, void>({
        queryFn: () => ({ data: undefined }),
        async onCacheEntryAdded(_, { cacheDataLoaded, cacheEntryRemoved, dispatch }) {
            try {
                await cacheDataLoaded;
                const userManagerSocket = getUserManagerSocket();

                userManagerSocket.on(ServerToAdmin.UsersUpdated, () => {
                    dispatch(apiSlice.util.invalidateTags(['Users']));
                });

                await cacheEntryRemoved;

                userManagerSocket.off(ServerToAdmin.UsersUpdated);
            } catch {
                // if cacheEntryRemoved resolved before cacheDataLoaded,
                // cacheDataLoaded throws
            }
        },
    });
