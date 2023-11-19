import { Request, Response } from 'express';
import { CollectionModel, ItemModel } from '../../models';
import { getItemPreview } from './utils';
import { GetCollectionItemsQuery, ItemPreview, ResponseError } from '../../types';

export const getCollectionItems = async (req: Request, res: Response<ItemPreview[]>) => {
    const queryParams = req.query as GetCollectionItemsQuery;

    const collectionId = queryParams.collectionId;
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;

    const existingCollection = await CollectionModel.findOne({ _id: collectionId });
    if (!existingCollection)
        throw new ResponseError(`Collection with id: ${collectionId} not found`, 404);

    const results = await ItemModel.find({
        _id: { $in: existingCollection.items },
    })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    res.status(200).json(results.map((item) => getItemPreview(item)));
};
