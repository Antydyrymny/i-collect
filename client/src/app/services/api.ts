import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    createApi,
    fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import {
    login,
    register,
    logout,
    clearAuth,
    updateJWT,
    statusOnline,
} from './features/auth';
import {
    subscribeToUsers,
    countUserPages,
    getUsers,
    getUserPage,
    toggleBlock,
    toggleAdmins,
    deleteUsers,
} from './features/users';
import { RootState } from '../store';
import {
    getUserCollections,
    getCollection,
    newCollection,
    updateCollection,
    deleteCollection,
    getCollectionItems,
    getItem,
    newItem,
    updateItem,
    deleteItem,
    toggleLikeItem,
    getItemComments,
    newComment,
    editComment,
    deleteComment,
    subscribeToItemUpdates,
    autocompleteTag,
    subscribeToHomeEvents,
    homePageSearch,
    findUserCollection,
} from './features/collections';
import {
    RefreshResponse,
    RefreshTokenRequest,
    Routes,
    isMessageError,
} from '../../types';

const baseUrl =
    import.meta.env.VITE_ENV === 'DEV'
        ? import.meta.env.VITE_DEV_URL
        : import.meta.env.VITE_SERVER_URL;

const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const reauthQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);
    if (
        result.error &&
        isMessageError(result.error) &&
        result.error.status === 403 &&
        result.error.data.message === 'Forbidden'
    ) {
        api.dispatch(clearAuth());
    } else if (
        result.error &&
        isMessageError(result.error) &&
        result.error.status === 401 &&
        result.error.data.message === 'Unauthorized'
    ) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            try {
                const refreshResult = await baseQuery(
                    {
                        url: Routes.RefreshToken,
                        method: 'POST',
                        body: ((): RefreshTokenRequest => ({
                            refreshToken:
                                (api.getState() as RootState).auth.refreshToken ?? '',
                        }))(),
                    },
                    api,
                    extraOptions
                );
                if (refreshResult.data) {
                    api.dispatch(updateJWT(refreshResult.data as RefreshResponse));
                    result = await baseQuery(args, api, extraOptions);
                } else {
                    api.dispatch(clearAuth());
                }
            } finally {
                release();
            }
        } else {
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }
    }
    return result;
};

const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: reauthQuery,
    tagTypes: ['UserPages', 'Users', 'CurCollection', 'CurItem'],
    endpoints: (builder) => ({
        login: login(builder),
        register: register(builder),
        logout: logout(builder),
        statusOnline: statusOnline(builder),
        subscribeToUsers: subscribeToUsers(builder),
        countUserPages: countUserPages(builder),
        getUsers: getUsers(builder),
        getUserPage: getUserPage(builder),
        toggleBlock: toggleBlock(builder),
        toggleAdmins: toggleAdmins(builder),
        deleteUsers: deleteUsers(builder),
        getUserCollections: getUserCollections(builder),
        findUserCollection: findUserCollection(builder),
        getCollection: getCollection(builder),
        newCollection: newCollection(builder),
        updateCollection: updateCollection(builder),
        deleteCollection: deleteCollection(builder),
        getCollectionItems: getCollectionItems(builder),
        getItem: getItem(builder),
        newItem: newItem(builder),
        updateItem: updateItem(builder),
        deleteItem: deleteItem(builder),
        toggleLikeItem: toggleLikeItem(builder),
        getItemComments: getItemComments(builder),
        newComment: newComment(builder),
        editComment: editComment(builder),
        deleteComment: deleteComment(builder),
        subscribeToItemUpdates: subscribeToItemUpdates(builder),
        autocompleteTag: autocompleteTag(builder),
        subscribeToHomeEvents: subscribeToHomeEvents(builder),
        homePageSearch: homePageSearch(builder),
    }),
});

export default apiSlice;

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useStatusOnlineMutation,
    useSubscribeToUsersQuery,
    useCountUserPagesQuery,
    useGetUsersQuery,
    useGetUserPageQuery,
    useToggleBlockMutation,
    useToggleAdminsMutation,
    useDeleteUsersMutation,
    useGetUserCollectionsQuery,
    useLazyFindUserCollectionQuery,
    useGetCollectionQuery,
    useNewCollectionMutation,
    useUpdateCollectionMutation,
    useDeleteCollectionMutation,
    useGetCollectionItemsQuery,
    useGetItemQuery,
    useNewItemMutation,
    useUpdateItemMutation,
    useToggleLikeItemMutation,
    useDeleteItemMutation,
    useGetItemCommentsQuery,
    useNewCommentMutation,
    useEditCommentMutation,
    useDeleteCommentMutation,
    useSubscribeToItemUpdatesQuery,
    useAutocompleteTagQuery,
    useSubscribeToHomeEventsQuery,
    useHomePageSearchQuery,
} = apiSlice;
