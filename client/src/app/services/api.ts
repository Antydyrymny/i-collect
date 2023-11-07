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
import { getCollection, newCollection } from './features/collections';
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
    tagTypes: ['UserPages', 'Users', 'CurCollection'],
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
        getCollection: getCollection(builder),
        newCollection: newCollection(builder),
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
    useGetCollectionQuery,
    useNewCollectionMutation,
} = apiSlice;
