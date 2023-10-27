import express from 'express';
import { protectedRoutesMiddleware, logout } from '../features/auth';
import { getUserPage } from '../features/manageUsers';
import { forwardErrors } from './forwardErrors';
import { Routes } from '../types';

const protectedRouter = express.Router();
protectedRouter.use(protectedRoutesMiddleware);

protectedRouter.post(Routes.Logout, forwardErrors(logout));
protectedRouter.get(Routes.GetUserPage, forwardErrors(getUserPage));

export { protectedRouter };
