import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { login, register, logout } from './features/auth';
import {
    subscribeToUsers,
    getUsers,
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
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        login: login(builder),
        register: register(builder),
        logout: logout(builder),
        subscribeToUsers: subscribeToUsers(builder),
        getUsers: getUsers(builder),
        toggleBlock: toggleBlock(builder),
        toggleAdmins: toggleAdmins(builder),
        deleteUsers: deleteUsers(builder),
    }),
});

export default apiSlice;

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } = apiSlice;
