import express from 'express';
import validate from './validate';
import forwardErrors from './forwardErrors';
import {
    login,
    refreshToken,
    register,
    validateLogin,
    validateRefreshToken,
    validateRegister,
} from '../features/auth';
import { Routes } from '../types';
import {
    getCollection,
    getCollectionItems,
    getItem,
    getItemComments,
    validateGetCollection,
    validateGetCollectionItems,
    validateGetItem,
    validateGetItemComments,
} from '../features/collections';

const router = express.Router();

router.post(Routes.Login, validate(validateLogin), forwardErrors(login));
router.post(Routes.Register, validate(validateRegister), forwardErrors(register));
router.get(
    Routes.GetCollection,
    validate(validateGetCollection),
    forwardErrors(getCollection)
);
router.get(
    Routes.GetCollectionItems,
    validate(validateGetCollectionItems),
    forwardErrors(getCollectionItems)
);
router.get(Routes.GetItem, validate(validateGetItem), forwardErrors(getItem));
router.get(
    Routes.GetItemComments,
    validate(validateGetItemComments),
    forwardErrors(getItemComments)
);
router.post(
    Routes.RefreshToken,
    validate(validateRefreshToken),
    forwardErrors(refreshToken)
);

export { router };
