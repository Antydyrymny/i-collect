import {
    Routes,
    ApiBuilder,
    AuthResponse,
    LoginRequest,
    RegisterRequest,
} from '../../../../types';

export const login = (builder: ApiBuilder) =>
    builder.mutation<AuthResponse, LoginRequest>({
        query: (credentials) => ({
            url: Routes.Login,
            method: 'POST',
            body: credentials,
        }),
    });

export const register = (builder: ApiBuilder) =>
    builder.mutation<AuthResponse, RegisterRequest>({
        query: (userData) => ({
            url: Routes.Register,
            method: 'POST',
            body: userData,
        }),
    });

export const logout = (builder: ApiBuilder) =>
    builder.mutation<string, 'statusOffline' | void>({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        query: (_arg) => ({
            url: Routes.Auth + Routes.Logout,
            method: 'POST',
        }),
    });

export const statusOnline = (builder: ApiBuilder) =>
    builder.mutation<AuthResponse, void>({
        query: () => ({
            url: Routes.Auth + Routes.SetOnline,
            method: 'POST',
        }),
    });
