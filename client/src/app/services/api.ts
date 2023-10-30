import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { login, register, logout, relog } from './features/auth';
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

const baseUrl =
    import.meta.env.VITE_ENV === 'DEV'
        ? import.meta.env.VITE_DEV_URL
        : import.meta.env.VITE_SERVER_URL;

const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['UserPages', 'Users'],
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
} = apiSlice;
