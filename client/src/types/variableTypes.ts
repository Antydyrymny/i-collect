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
    'UserPages' | 'Users',
    'api'
>;

export enum ClientRoutes {
    Home = '/',
    Register = '/register',
    Login = '/login',
    ManageUsers = '/users',
    UserPage = '/user/:userId',
    UserPagePath = '/user/',
}

export enum Routes {
    Api = '/v1',
    ManageUsers = '/manageUsers',
    Login = '/login',
    Register = '/register',
    Logout = '/logout',
    Relog = '/relog',
    CountUserPages = '/countUserPages',
    GetUsers = '/users',
    GetUserPage = '/userPage',
    ToggleBlock = '/block',
    DeleteUsers = '/deleteUsers',
    ToggleAdmin = '/toggleAdmin',
}

export type ColorTheme = 'light' | 'dark';
export type Locale = 'en' | 'ru';
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
export type UserPreview = {
    _id: string;
    admin: boolean;
    name: string;
    status: 'online' | 'offline' | 'blocked';
};
export type ClientUser = UserPreview & {
    email: string;
    createdAt: string;
    lastLogin: string;
    collectionIds: string[];
};
