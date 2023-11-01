import express from 'express';
import { adminRoutesMiddleware } from '../features/auth';
import validate from './validate';
import forwardErrors from './forwardErrors';
import {
    countUserPages,
    getUsers,
    toggleAdmins,
    toggleBlock,
    deleteUsers,
    validateDeleteUsers,
    validateToggleAdmin,
    validateToggleBlock,
    validateUsersQuery,
} from '../features/manageUsers';
import { Routes } from '../types';

const adminRouter = express.Router();
adminRouter.use(adminRoutesMiddleware);

adminRouter.get(Routes.CountUserPages, forwardErrors(countUserPages));
adminRouter.get(Routes.GetUsers, validate(validateUsersQuery), forwardErrors(getUsers));
adminRouter.patch(
    Routes.ToggleAdmin,
    validate(validateToggleAdmin),
    forwardErrors(toggleAdmins)
);
adminRouter.patch(
    Routes.ToggleBlock,
    validate(validateToggleBlock),
    forwardErrors(toggleBlock)
);
adminRouter.delete(
    Routes.DeleteUsers,
    validate(validateDeleteUsers),
    forwardErrors(deleteUsers)
);

export { adminRouter };
