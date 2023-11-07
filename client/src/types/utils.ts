import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { colorThemeKey, authStateKey, localeKey } from '../data/localStorageKeys';
import { AuthState } from '.';

export type ApiBuilder = EndpointBuilder<
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
    'UserPages' | 'Users' | 'CurCollection',
    'api'
>;

export type ColorTheme = 'light' | 'dark';
export type Locale = 'en' | 'ru';
export type LocalStorageSchema = {
    [colorThemeKey]: ColorTheme;
    [authStateKey]: AuthState;
    [localeKey]: Locale;
};
