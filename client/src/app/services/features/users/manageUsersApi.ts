import {
    Routes,
    ApiBuilder,
    User,
    ToggleBlockRequest,
    ToggleAdminRequest,
    GetUsersRequest,
} from '../../../../types';

const defaultGetUsersQueryParams = {
    limit: '20',
};

export const getUsers = (builder: ApiBuilder) =>
    builder.query<User[], GetUsersRequest>({
        query: (request) => ({
            url: Routes.GetUsers,
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

export const toggleBlock = (builder: ApiBuilder) =>
    builder.mutation<string, ToggleBlockRequest>({
        query: (toggleBlockRequest) => ({
            url: Routes.ToggleBlock,
            method: 'PATCH',
            body: toggleBlockRequest,
        }),
        invalidatesTags: ['Users'],
    });

export const toggleAdmins = (builder: ApiBuilder) =>
    builder.mutation<string, ToggleAdminRequest>({
        query: (toggleAdminRequest) => ({
            url: Routes.ToggleAdmin,
            method: 'PATCH',
            body: toggleAdminRequest,
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
