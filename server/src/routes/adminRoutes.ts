import express from 'express';
import { adminRoutesMiddleware } from '../features/auth';
import { forwardErrors } from './forwardErrors';
import {
    getUsers,
    toggleAdmins,
    toggleBlock,
    deleteUsers,
} from '../features/manageUsers';
import { Routes } from '../types';

const adminRouter = express.Router();
adminRouter.use(adminRoutesMiddleware);

adminRouter.get(Routes.GetUsers, forwardErrors(getUsers));
adminRouter.patch(Routes.ToggleAdmin, forwardErrors(toggleAdmins));
adminRouter.patch(Routes.ToggleBlock, forwardErrors(toggleBlock));
adminRouter.delete(Routes.DeleteUsers, forwardErrors(deleteUsers));

export { adminRouter };
