export enum Routes {
    Api = '/v1',
    ManageUsers = '/manageUsers',
    Login = '/login',
    Register = '/register',
    Logout = '/logout',
    Relog = '/relog',
    GetUsers = '/users',
    GetUserPage = '/userPage',
    ToggleBlock = '/block',
    DeleteUsers = '/deleteUsers',
    ToggleAdmin = '/toggleAdmin',
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

export type ToggleBlockRequest = {
    action: 'block' | 'unblock';
    userIds: string[];
};

export type ToggleAdminRequest = {
    action: 'makeAdmin' | 'stripAdmin';
    userIds: string[];
};

export type UserType = 'admin' | 'user';
export type UserPreview = {
    _id: string;
    admin: boolean;
    name: string;
    status: 'online' | 'offline' | 'blocked';
};
export type ClientUser = UserPreview & {
    email: string;
    createdAt: string;
    lastLogin: string;
    collectionIds: string[];
};
export type User = ClientUser & { password: string };
