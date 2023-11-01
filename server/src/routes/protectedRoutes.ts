import express from 'express';
import { protectedRoutesMiddleware, logout, relog } from '../features/auth';
import validate from './validate';
import forwardErrors from './forwardErrors';
import { getUserPage, validateUserPage } from '../features/manageUsers';
import { Routes } from '../types';

const protectedRouter = express.Router();
protectedRouter.use(protectedRoutesMiddleware);

protectedRouter.post(Routes.Logout, forwardErrors(logout));
protectedRouter.post(Routes.Relog, forwardErrors(relog));
protectedRouter.get(
    Routes.GetUserPage,
    validate(validateUserPage),
    forwardErrors(getUserPage)
);

export { protectedRouter };
