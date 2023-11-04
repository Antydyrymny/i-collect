import {
    Routes,
    ApiBuilder,
    UserPreview,
    ClientUser,
    ToggleBlockRequest,
    ToggleAdminRequest,
    GetUsersRequest,
    AdminQuery,
} from '../../../../types';

const defaultGetUsersQueryParams = {
    limit: '10',
};

export const countUserPages = (builder: ApiBuilder) =>
    builder.query<number, void>({
        query: () => ({ url: Routes.Admin + Routes.CountUserPages }),
    });

export const getUsers = (builder: ApiBuilder) =>
    builder.query<UserPreview[], GetUsersRequest>({
        query: (request) => ({
            url: Routes.Admin + Routes.GetUsers,
            params: { ...defaultGetUsersQueryParams, ...request },
        }),
        serializeQueryArgs: ({ endpointName }) => {
            return endpointName;
        },
        forceRefetch: ({ currentArg, previousArg }) => {
            return (
                typeof currentArg !== typeof previousArg ||
                (!!currentArg &&
                    !!previousArg &&
                    !Object.values(currentArg).every(
                        (el, ind) => Object.values(previousArg)[ind] === el
                    ))
            );
        },
        providesTags: ['Users'],
    });

export const getUserPage = (builder: ApiBuilder) =>
    builder.query<ClientUser, AdminQuery | void>({
        query: (adminQuery) => ({
            url: Routes.Admin + Routes.GetUserPage,
            params: adminQuery ?? undefined,
        }),
    });

export const toggleBlock = (builder: ApiBuilder) =>
    builder.mutation<string, ToggleBlockRequest>({
        query: (toggleBlockRequest) => ({
            url: Routes.Admin + Routes.ToggleBlock,
            method: 'PATCH',
            body: toggleBlockRequest,
        }),
        invalidatesTags: ['Users'],
    });

export const toggleAdmins = (builder: ApiBuilder) =>
    builder.mutation<string, ToggleAdminRequest>({
        query: (toggleAdminRequest) => ({
            url: Routes.Admin + Routes.ToggleAdmin,
            method: 'PATCH',
            body: toggleAdminRequest,
        }),
        invalidatesTags: ['Users'],
    });

export const deleteUsers = (builder: ApiBuilder) =>
    builder.mutation<string, string[]>({
        query: (usersToDelete) => ({
            url: Routes.Admin + Routes.DeleteUsers,
            method: 'DELETE',
            body: usersToDelete,
        }),
        invalidatesTags: ['Users'],
    });
