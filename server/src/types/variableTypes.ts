export enum Routes {
    Api = '/api',
    ManageUsers = '/manageUsers',
    Login = '/login',
    Register = '/register',
    Logout = '/logout',
    GetUsers = '/users',
    BlockUsers = '/block',
    UnblockUsers = '/unblock',
    DeleteUsers = '/deleteUsers',
    MakeAdmins = '/makeAdmins',
    StripAdmins = '/stripAdmins',
}

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

export type UserType = 'admin' | 'user';
export type User = {
    _id: string;
    userType: UserType;
    name: string;
    email: string;
    createdAt: string;
    lastLogin: string;
    status: 'online' | 'offline' | 'blocked';
    collectionIds: string[];
};
