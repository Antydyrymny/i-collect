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
    builder.mutation<string, void>({
        query: () => ({
            url: Routes.Logout,
            method: 'POST',
        }),
    });

export const relog = (builder: ApiBuilder) =>
    builder.mutation<string, void>({
        query: () => ({
            url: Routes.Relog,
            method: 'POST',
        }),
    });
