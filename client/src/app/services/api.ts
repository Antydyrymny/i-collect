import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    createApi,
    fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { login, register, logout, relog, clearAuth } from './features/auth';
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
} from './features/collections';
import { isMessageError } from '../../types';

const baseUrl =
    import.meta.env.VITE_ENV === 'DEV'
        ? import.meta.env.VITE_DEV_URL
        : import.meta.env.VITE_SERVER_URL;

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
const baseQueryWithAuthManagement: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    if (
        result.error &&
        isMessageError(result.error) &&
        result.error.status === 403 &&
        result.error.data.message === 'Forbidden'
    ) {
        api.dispatch(clearAuth());
    }
    return result;
};

const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithAuthManagement,
    tagTypes: ['UserPages', 'Users', 'CurCollection', 'CurItem'],
    endpoints: (builder) => ({
        login: login(builder),
        register: register(builder),
        logout: logout(builder),
        relog: relog(builder),
        subscribeToUsers: subscribeToUsers(builder),
        countUserPages: countUserPages(builder),
        getUsers: getUsers(builder),
        getUserPage: getUserPage(builder),
        toggleBlock: toggleBlock(builder),
        toggleAdmins: toggleAdmins(builder),
        deleteUsers: deleteUsers(builder),
        getUserCollections: getUserCollections(builder),
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
    }),
});

export default apiSlice;

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useRelogMutation,
    useSubscribeToUsersQuery,
    useCountUserPagesQuery,
    useGetUsersQuery,
    useGetUserPageQuery,
    useToggleBlockMutation,
    useToggleAdminsMutation,
    useDeleteUsersMutation,
    useGetUserCollectionsQuery,
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
} = apiSlice;
