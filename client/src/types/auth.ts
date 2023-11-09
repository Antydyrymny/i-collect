export type LoginRequest = {
    email: string;
    password: string;
};
export type RegisterRequest = LoginRequest & { name: string };
export type RefreshTokenRequest = { refreshToken: string };
export type RefreshResponse = {
    token: string;
};

export type AuthResponse = {
    _id: string;
    admin: boolean;
    name: string;
    token: string;
    refreshToken: string;
};
export type AuthState = { [K in keyof AuthResponse]: AuthResponse[K] | null };
