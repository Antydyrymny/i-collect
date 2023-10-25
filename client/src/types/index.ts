import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import getSocket from '../app/services/getSocket';
import { colorThemeKey, userNameKey } from '../data/localStorageKeys';

export type ApiSocket = ReturnType<typeof getSocket>;
export type ApiBuilder = EndpointBuilder<
    BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        object,
        FetchBaseQueryMeta
    >,
    never,
    'api'
>;

export type ColorTheme = 'light' | 'dark';

export type LocalStorageSchema = {
    [colorThemeKey]: ColorTheme;
    [userNameKey]: string;
};
