export enum Routes {
    Api = '/api',
    ManageUsers = '/manageUsers',
    Login = '/login',
    Register = '/register',
    Logout = '/logout',
    GetUsers = '/users',
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
export type ClientUser = {
    _id: string;
    admin: boolean;
    name: string;
    email: string;
    createdAt: string;
    lastLogin: string;
    status: 'online' | 'offline' | 'blocked';
    collectionIds: string[];
};
export type User = ClientUser & { password: string };
