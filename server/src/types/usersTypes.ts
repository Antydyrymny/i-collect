import { Schema } from 'mongoose';

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
    lastLogin: Date;
};
export type ClientUser = UserPreview & {
    email: string;
    createdAt: Date;
    collections: Schema.Types.ObjectId[];
};
export type User = ClientUser & { password: string };

export type AdminQuery = {
    ownerId: string;
};

export type UsersQuery = {
    page: string;
    limit: string;
};
