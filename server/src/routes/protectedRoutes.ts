import express from 'express';
import { protectedRoutesMiddleware, logout, relog } from '../features/auth';
import validate from './validate';
import forwardErrors from './forwardErrors';
import { getUserPage } from '../features/manageUsers';
import {
    newCollection,
    validateNewCollection,
    updateCollection,
    validateUpdateCollection,
    deleteCollection,
    validateDeleteCollection,
} from '../features/collections';
import { Routes } from '../types';

const protectedRouter = express.Router();
protectedRouter.use(protectedRoutesMiddleware);

protectedRouter.post(Routes.Logout, forwardErrors(logout));
protectedRouter.post(Routes.Relog, forwardErrors(relog));
protectedRouter.get(Routes.GetUserPage, forwardErrors(getUserPage));
protectedRouter.post(
    Routes.NewCollection,
    validate(validateNewCollection),
    forwardErrors(newCollection)
);
protectedRouter.patch(
    Routes.UpdateCollection,
    validate(validateUpdateCollection),
    forwardErrors(updateCollection)
);
protectedRouter.delete(
    Routes.DeleteCOllection,
    validate(validateDeleteCollection),
    forwardErrors(deleteCollection)
);

export { protectedRouter };
