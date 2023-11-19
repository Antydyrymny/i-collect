import express from 'express';
import { protectedRoutesMiddleware, logout, setOnline } from '../features/auth';
import validate from './validate';
import forwardErrors from './forwardErrors';
import { getUserPage } from '../features/manageUsers';
import {
    validateNewCollection,
    newCollection,
    validateUpdateCollection,
    updateCollection,
    validateDeleteCollection,
    deleteCollection,
    validateNewItem,
    newItem,
    validateUpdateItem,
    updateItem,
    validateDeleteItem,
    deleteItem,
    validateToggleLikeReq,
    toggleLikeItem,
    validateNewComment,
    newComment,
    validateEditComment,
    editComment,
    validateDeleteComment,
    deleteComment,
    validateUserCollections,
    getUserCollections,
    validateGetUserCollection,
    findUserCollection,
} from '../features/collections';
import { Routes } from '../types';

const protectedRouter = express.Router();
protectedRouter.use(protectedRoutesMiddleware);

protectedRouter.post(Routes.Logout, forwardErrors(logout));
protectedRouter.post(Routes.SetOnline, forwardErrors(setOnline));
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
    Routes.DeleteCollection,
    validate(validateDeleteCollection),
    forwardErrors(deleteCollection)
);
protectedRouter.post(Routes.NewItem, validate(validateNewItem), forwardErrors(newItem));
protectedRouter.patch(
    Routes.UpdateItem,
    validate(validateUpdateItem),
    forwardErrors(updateItem)
);
protectedRouter.delete(
    Routes.DeleteItem,
    validate(validateDeleteItem),
    forwardErrors(deleteItem)
);
protectedRouter.patch(
    Routes.ToggleLikeItem,
    validate(validateToggleLikeReq),
    forwardErrors(toggleLikeItem)
);
protectedRouter.post(
    Routes.NewComment,
    validate(validateNewComment),
    forwardErrors(newComment)
);
protectedRouter.patch(
    Routes.EditComment,
    validate(validateEditComment),
    forwardErrors(editComment)
);
protectedRouter.delete(
    Routes.DeleteComment,
    validate(validateDeleteComment),
    forwardErrors(deleteComment)
);
protectedRouter.get(
    Routes.FindUserCollections,
    validate(validateGetUserCollection),
    forwardErrors(findUserCollection)
);
protectedRouter.get(
    Routes.GetUserCollections,
    validate(validateUserCollections),
    forwardErrors(getUserCollections)
);

export { protectedRouter };
