import { object, array, string } from 'yup';
import { UserQuery, ToggleAdminRequest, ToggleBlockRequest } from '../../types';

export const validateDeleteUsers = object({
    body: array()
        .min(1, 'User IDs are required')
        .of(string().required('User ID is required')),
});

export const validateUserPage = object({
    query: object<UserQuery>().shape({
        id: string().required('User ID is required'),
    }),
});

export const validateUsersQuery = object({
    query: object<UserQuery>().shape({
        page: string().matches(/^\d+$/, 'Page must be a stringified number'),
        limit: string().matches(/^\d+$/, 'Limit must be a stringified number'),
    }),
});

export const validateToggleAdmin = object({
    body: object<ToggleAdminRequest>().shape({
        action: string()
            .oneOf(['makeAdmin', 'stripAdmin'])
            .required('Action is required'),
        userIds: array()
            .min(1, 'User IDs are required')
            .of(string().required('User ID is required')),
    }),
});

export const validateToggleBlock = object({
    body: object<ToggleBlockRequest>().shape({
        action: string().oneOf(['block', 'unblock']).required('Action is required'),
        userIds: array()
            .min(1, 'User IDs are required')
            .of(string().required('User ID is required')),
    }),
});
