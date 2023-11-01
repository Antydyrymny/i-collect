import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { colorThemeKey, authStateKey, localeKey } from '../data/localStorageKeys';
import { AuthState } from '.';

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

export type ColorTheme = 'light' | 'dark';
export type Locale = 'en' | 'ru';
export type LocalStorageSchema = {
    [colorThemeKey]: ColorTheme;
    [authStateKey]: AuthState;
    [localeKey]: Locale;
};
