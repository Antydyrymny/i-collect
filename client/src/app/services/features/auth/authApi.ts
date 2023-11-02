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
    builder.mutation<string, string>({
        query: (userId) => ({
            url: Routes.Auth + Routes.Logout,
            method: 'POST',
            params: { id: userId },
        }),
    });

export const relog = (builder: ApiBuilder) =>
    builder.mutation<AuthResponse, string>({
        query: (userId) => ({
            url: Routes.Auth + Routes.Relog,
            method: 'POST',
            params: { id: userId },
        }),
    });
