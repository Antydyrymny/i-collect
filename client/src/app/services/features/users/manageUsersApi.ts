import { Routes, ApiBuilder, User } from '../../../../types';

export const getUsers = (builder: ApiBuilder) =>
    builder.query<User[], void>({
        query: () => Routes.GetUsers,
        providesTags: ['Users'],
    });

export const blockUsers = (builder: ApiBuilder) =>
    builder.mutation<string, string[]>({
        query: (usersToBlock) => ({
            url: Routes.BlockUsers,
            method: 'PATCH',
            body: usersToBlock,
        }),
        invalidatesTags: ['Users'],
    });

export const unblockUsers = (builder: ApiBuilder) =>
    builder.mutation<string, string[]>({
        query: (blockedUsers) => ({
            url: Routes.UnblockUsers,
            method: 'PATCH',
            body: blockedUsers,
        }),
        invalidatesTags: ['Users'],
    });

export const deleteUsers = (builder: ApiBuilder) =>
    builder.mutation<string, string[]>({
        query: (usersToDelete) => ({
            url: Routes.DeleteUsers,
            method: 'DELETE',
            body: usersToDelete,
        }),
        invalidatesTags: ['Users'],
    });

export const makeAdmins = (builder: ApiBuilder) =>
    builder.mutation<string, string[]>({
        query: (usersToMakeAdmin) => ({
            url: Routes.MakeAdmins,
            method: 'PATCH',
            body: usersToMakeAdmin,
        }),
        invalidatesTags: ['Users'],
    });

export const stripAdmins = (builder: ApiBuilder) =>
    builder.mutation<string, string[]>({
        query: (strippedAdmins) => ({
            url: Routes.MakeAdmins,
            method: 'PATCH',
            body: strippedAdmins,
        }),
        invalidatesTags: ['Users'],
    });
