import { Request, Response } from 'express';
import { UserModel } from '../../models';
import { authorizeResourceOwnership } from '../manageUsers';
import { getCollectionPreview } from './utils';
import {
    CollectionModelType,
    CollectionPreview,
    CollectionsPreviewQuery,
    ResponseError,
} from '../../types';

export const userCollections = async (
    req: Request,
    res: Response<CollectionPreview[]>
) => {
    const queryParams = req.query as CollectionsPreviewQuery;

    const userId = authorizeResourceOwnership(req);
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;

    const existingUser = await UserModel.findOne(
        { _id: userId },
        { collections: { $slice: [(page - 1) * limit, limit] } }
    ).populate<{
        collections: CollectionModelType[];
    }>('collections');

    if (!existingUser) throw new ResponseError(`User with id: ${userId} not found`, 404);

    res.status(200).json(
        existingUser.collections.map((collection) => getCollectionPreview(collection))
    );
};
