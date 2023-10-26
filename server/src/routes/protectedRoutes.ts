import express from 'express';
import { protectedRoutesMiddleware, logout } from '../features/auth';
import {
    getUsers,
    toggleAdmins,
    toggleBlock,
    deleteUsers,
} from '../features/manageUsers';
import { Routes } from '../types';

const protectedRouter = express.Router();
protectedRouter.use(protectedRoutesMiddleware);

protectedRouter.post(Routes.Logout, logout);
protectedRouter.get(Routes.GetUsers, getUsers);
protectedRouter.patch(Routes.ToggleAdmin, toggleAdmins);
protectedRouter.patch(Routes.ToggleBlock, toggleBlock);
protectedRouter.delete(Routes.DeleteUsers, deleteUsers);

export { protectedRouter };
