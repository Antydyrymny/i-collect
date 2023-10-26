import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { colorThemeKey, authStateKey, localeKey } from '../data/localStorageKeys';

export type ApiBuilder = EndpointBuilder<
    BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        object,
        FetchBaseQueryMeta
    >,
    'Users',
    'api'
>;

export enum Routes {
    Api = '/api',
    ManageUsers = '/manageUsers',
    Login = '/login',
    Register = '/register',
    Logout = '/logout',
    GetUsers = '/users',
    ToggleBlock = '/block',
    DeleteUsers = '/deleteUsers',
    ToggleAdmin = '/toggleAdmin',
}

export type ColorTheme = 'light' | 'dark';
export type Locale = 'ENG' | 'KA';
export type LocalStorageSchema = {
    [colorThemeKey]: ColorTheme;
    [authStateKey]: AuthState;
    [localeKey]: Locale;
};

export type AuthResponse = {
    _id: string;
    admin: boolean;
    name: string;
    token: string;
};
export type AuthState = { [K in keyof AuthResponse]: AuthResponse[K] | null };

export type LoginRequest = {
    email: string;
    password: string;
};
export type RegisterRequest = LoginRequest & { name: string };

export type ToggleBlockRequest = {
    action: 'block' | 'unblock';
    userIds: string[];
};

export type ToggleAdminRequest = {
    action: 'makeAdmin' | 'stripAdmin';
    userIds: string[];
};

export type GetUsersRequest = {
    page: number;
};

export type UserType = 'admin' | 'user';
export type User = {
    _id: string;
    admin: boolean;
    name: string;
    email: string;
    createdAt: string;
    lastLogin: string;
    status: 'online' | 'offline' | 'blocked';
    collectionIds: string[];
};
