import express from 'express';
import { protectedRoutesMiddleware, logout } from '../features/auth';
import { forwardErrors } from './forwardErrors';
import { Routes } from '../types';

const protectedRouter = express.Router();
protectedRouter.use(protectedRoutesMiddleware);

protectedRouter.post(Routes.Logout, forwardErrors(logout));

export { protectedRouter };
