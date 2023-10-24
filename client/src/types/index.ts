import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import getSocket from '../app/services/getSocket';
import { colorTheme, userNameKey } from '../data/localStorageKeys';

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

export type LocalStorageSchema = {
    [colorTheme]: 'light' | 'dark';
    [userNameKey]: string;
};
