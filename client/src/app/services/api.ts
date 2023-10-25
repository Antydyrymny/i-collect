import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { login, register, logout } from './features/auth/authApi';
import { subscribeToUsers } from './features/users/subscribeToUserUpdates';
import {
    getUsers,
    blockUsers,
    unblockUsers,
    deleteUsers,
    makeAdmins,
    stripAdmins,
} from './features/users/manageUsersApi';
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
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        login: login(builder),
        register: register(builder),
        logout: logout(builder),
        subscribeToUsers: subscribeToUsers(builder),
        getUsers: getUsers(builder),
        blockUsers: blockUsers(builder),
        unblockUsers: unblockUsers(builder),
        deleteUsers: deleteUsers(builder),
        makeAdmins: makeAdmins(builder),
        stripAdmins: stripAdmins(builder),
    }),
});

export default apiSlice;

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } = apiSlice;
