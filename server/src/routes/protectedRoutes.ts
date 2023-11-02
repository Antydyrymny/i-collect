import express from 'express';
import { protectedRoutesMiddleware, logout, relog } from '../features/auth';
// import validate from './validate';
import forwardErrors from './forwardErrors';
import { getUserPage } from '../features/manageUsers';
import { Routes } from '../types';

const protectedRouter = express.Router();
protectedRouter.use(protectedRoutesMiddleware);

protectedRouter.post(Routes.Logout, forwardErrors(logout));
protectedRouter.post(Routes.Relog, forwardErrors(relog));
protectedRouter.get(Routes.GetUserPage, forwardErrors(getUserPage));

export { protectedRouter };
