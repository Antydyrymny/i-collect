import { Request, Response } from 'express';
import { CollectionModel, UserModel } from '../../models';
import { getCollectionPreview } from './utils';
import { authorizeResourceOwnership } from '../manageUsers';
import { CollectionPreview, GetUserCollectionQuery, ResponseError } from '../../types';

export const findUserCollection = async (
    req: Request,
    res: Response<CollectionPreview[]>
) => {
    const queryParams = req.query as GetUserCollectionQuery;
    const { query } = queryParams;
    const ownerId = authorizeResourceOwnership(req);

    const existingUser = await UserModel.findById(ownerId);
    if (!existingUser) throw new ResponseError(`User with id: ${ownerId} not found`, 404);

    const results = await CollectionModel.find({
        _id: { $in: existingUser.collections },
        $text: {
            $search: query,
            $caseSensitive: false,
            $diacriticSensitive: false,
        },
    })
        .sort({ score: { $meta: 'textScore' } })
        .limit(10);

    res.status(200).json(results.map((collection) => getCollectionPreview(collection)));
};
