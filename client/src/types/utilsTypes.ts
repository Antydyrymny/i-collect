import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { colorThemeKey, localeKey } from '../data/localStorageKeys';

export type ApiBuilder = EndpointBuilder<
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
    'UserPages' | 'Users' | 'CurCollection' | 'CurItem',
    'api'
>;

export type ColorTheme = 'light' | 'dark';
export type Locale = 'en' | 'ru' | 'ge';
export type LocalStorageSchema = {
    [colorThemeKey]: ColorTheme;
    [localeKey]: Locale;
};

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
